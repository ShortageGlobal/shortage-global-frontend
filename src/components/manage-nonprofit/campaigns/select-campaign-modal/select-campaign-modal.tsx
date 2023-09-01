import styles from './select-campaign-modal.module.scss';
import { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Modal, InputGroup, Form, Button } from 'react-bootstrap';
import { Search, Plus } from 'react-feather';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import { fetchAccountCampaigns } from 'core/api';
import { formatDateForHumans } from 'core/helpers';
import { LoadingMessage } from 'components/loading-message/loading-message';
import { Card } from 'components/card/card';
import type { AccountOrganization, AccountCampaign } from 'core/api/types';

type SelectCampaignModalProps = {
  organization: AccountOrganization;
  show: boolean;
  onHide: () => void;
  onSelect: (campaignUuid: AccountCampaign['uuid']) => void;
};

export function SelectCampaignModal({
  organization,
  show,
  onHide,
  onSelect,
}: SelectCampaignModalProps) {
  const { showNotification } = useNotifications();

  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<AccountCampaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getFetchCampaignsCancelToken = useCancelToken();

  const debouncedFetchCampaigns = useDebouncedCallback(
    async ({
      organizationSlug,
      search,
      offset,
      limit,
    }: {
      organizationSlug: AccountOrganization['slug'];
      search: string;
      offset?: number;
      limit?: number;
    }) => {
      const cancelToken = getFetchCampaignsCancelToken();

      setIsLoading(true);

      try {
        const response = await fetchAccountCampaigns({
          organizationSlug,
          search,
          offset,
          limit,
          cancelToken,
        });

        setCampaigns(response.data.results);
        setIsLoading(false);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        const rejectionErrors = rejection?.response?.data;
        showNotification({
          isFailure: true,
          message: rejectionErrors?.details || 'Failed to get Campaigns',
        });
        setIsLoading(false);
      }
    },
    250
  );

  useEffect(() => {
    if (!show) {
      return;
    }
    debouncedFetchCampaigns({
      organizationSlug: organization.slug,
      search: searchQuery,
      offset: 0,
      limit: 5,
    });

    return () => {
      debouncedFetchCampaigns.cancel();
    };
  }, [organization.slug, searchQuery, show]);

  const handleSelect = useCallback(
    (campaign: AccountCampaign) => {
      onSelect(campaign.uuid);
    },
    [onSelect]
  );

  const handleResetOnExit = useCallback(() => {
    setSearchQuery('');
    setIsLoading(true);
    setCampaigns([]);
  }, []);

  return (
    <Modal
      scrollable
      size="lg"
      show={show}
      onHide={onHide}
      onExited={handleResetOnExit}
      className={styles.modal}
      aria-labelledby="select-campaign-modal-title"
    >
      <Modal.Header closeButton className={styles.header}>
        <div className={styles.headerContent}>
          <Modal.Title id="select-campaign-modal-title">
            Select Campaign
          </Modal.Title>

          <Form className={styles.searchContainer}>
            <InputGroup>
              <InputGroup.Text
                as="label"
                htmlFor="search-select-campaign-input"
              >
                <Search />
              </InputGroup.Text>
              <Form.Control
                id="search-select-campaign-input"
                placeholder="Search"
                autoFocus
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Form>
        </div>
      </Modal.Header>

      <Modal.Body className={styles.body}>
        <div className={styles.content}>
          {/* Loading */}
          {!campaigns?.length && isLoading ? <LoadingMessage /> : null}

          {/* No campaigns */}
          {campaigns?.length === 0 && !isLoading ? (
            <>
              <p>No Campaigns found.</p>

              {searchQuery?.length > 0 ? (
                <Button
                  variant="outline-dark"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              ) : null}
            </>
          ) : null}

          {campaigns?.length > 0 ? (
            <div
              className={classNames(styles.list, {
                [styles.loading]: isLoading,
              })}
            >
              {campaigns.map((campaign) => {
                const details = [
                  {
                    key: 'updated on',
                    value: formatDateForHumans({
                      date: campaign.updated_at,
                      isMonthShort: true,
                    }),
                  },
                  {
                    key: 'published',
                    value: campaign.is_draft ? 'no' : 'yes',
                  },
                ];
                return (
                  <Card
                    key={campaign.uuid}
                    onClick={() => handleSelect(campaign)}
                    image={campaign.banner}
                    title={campaign.name}
                    description={campaign.meta_description}
                    details={details}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Link
          href={{
            pathname:
              '/private/manage-nonprofit/[organizationSlug]/campaigns/create',
            query: {
              organizationSlug: organization.slug,
            },
          }}
          passHref
          legacyBehavior
        >
          <Button variant="outline-dark">
            <Plus />
            <span>Add Campaign</span>
          </Button>
        </Link>

        <Button onClick={onHide} variant="outline-dark">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
