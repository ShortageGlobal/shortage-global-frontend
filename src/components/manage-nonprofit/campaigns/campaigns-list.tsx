import commonStyles from 'styles/pages/private/common.module.scss';
import { useEffect, useState } from 'react';
import { Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import classNames from 'classnames';
import { Search } from 'react-feather';
import {
  useAppSelector,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import { useDebouncedCallback } from 'use-debounce';
import { fetchAccountCampaigns } from 'core/api';
import { Pagination } from 'components/pagination/pagination';
import { LoadingMessage } from 'components/loading-message/loading-message';
import { CampaignCard } from 'components/manage-nonprofit/campaigns/campaign-card/campaign-card';
import { DEFAULT_PAGE_SIZE } from 'core/constants';
import type { AccountOrganization, AccountCampaign } from 'core/api/types';

export function CampaignsList() {
  const { showNotification } = useNotifications();
  const { organization } = useAppSelector(selectAccountOrganization);

  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalCount, setTotalCount] = useState(null);
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
        setTotalCount(response.data.count);
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
    debouncedFetchCampaigns({
      organizationSlug: organization.slug,
      search: searchQuery,
      offset: pageSize * pageNumber,
      limit: pageSize,
    });

    return () => {
      debouncedFetchCampaigns.cancel();
    };
  }, [organization.slug, searchQuery, pageSize, pageNumber]);

  return (
    <div>
      <Row className={commonStyles.listControls}>
        <Col>
          <InputGroup>
            <InputGroup.Text as="label" htmlFor="search-input">
              <Search />
            </InputGroup.Text>
            <Form.Control
              id="search-input"
              className={commonStyles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col className={commonStyles.paginationCol}>
          {campaigns?.length > 0 ? (
            <Pagination
              pageSize={pageSize}
              pageNumber={pageNumber}
              totalCount={totalCount}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              onPageNumberChange={(newPageNumber) =>
                setPageNumber(newPageNumber)
              }
            />
          ) : null}
        </Col>
      </Row>

      {/* Loading */}
      {!campaigns?.length && isLoading ? <LoadingMessage /> : null}

      {/* No campaigns */}
      {campaigns?.length === 0 && !isLoading ? (
        <div>
          <p>No Campaigns found.</p>
          {searchQuery?.length > 0 ? (
            <Button variant="outline-dark" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          ) : null}
        </div>
      ) : null}

      {/* Campaigns list */}
      {campaigns?.length > 0 ? (
        <div
          className={classNames(commonStyles.list, {
            [commonStyles.loading]: isLoading,
          })}
        >
          {campaigns.map((campaign) => {
            return (
              <CampaignCard
                key={campaign.uuid}
                campaign={campaign}
                organization={organization}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
