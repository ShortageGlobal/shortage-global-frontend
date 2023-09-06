import styles from './campaigns.module.scss';
import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Container, Row, Col, Button } from 'react-bootstrap';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector, useCancelToken } from 'core/hooks';
import { selectOrganization } from 'core/store/slices/organization';
import { SectionHeader } from 'components/section-header/section-header';
import {
  fetchCampaigns,
  selectCampaigns,
  setIsLoading,
} from 'core/store/slices/campaigns';
import { CampaignCard } from 'components/organization/campaigns/campaign-card/campaign-card';
import { CAMPAIGNS_PAGE_SIZE } from 'core/constants';

export function Campaigns() {
  const dispatch = useAppDispatch();
  const { organization } = useAppSelector(selectOrganization);
  const { campaigns, count, isLoading } = useAppSelector(selectCampaigns);
  const getFetchCampaignsCancelToken = useCancelToken();

  const debouncedFetchCampaigns = useDebouncedCallback(
    ({
      offset = 0,
      limit = CAMPAIGNS_PAGE_SIZE,
    }: {
      offset?: number;
      limit?: number;
    }) => {
      // fetch campaigns
      const cancelToken = getFetchCampaignsCancelToken();
      dispatch(
        fetchCampaigns({
          organizationSlug: organization.slug,
          offset,
          limit,
          cancelToken,
        })
      );
    },
    250
  );

  // user clicked "Show more"
  const handleShowMore = useCallback(() => {
    dispatch(setIsLoading(true));
    debouncedFetchCampaigns({
      offset: campaigns.length,
      limit: CAMPAIGNS_PAGE_SIZE,
    });
  }, [campaigns]);

  return (
    <div className={styles.campaigns}>
      {/* Header */}
      <Container>
        <Row>
          <Col>
            <SectionHeader>Campaigns</SectionHeader>
          </Col>
        </Row>
      </Container>

      {/* Campaigns List */}
      <Container>
        <Row>
          <Col>
            <div
              className={classNames(styles.campaignsContainer, {
                [styles.campaignsContainerLoading]: isLoading,
              })}
            >
              {campaigns?.map((campaign) => {
                return (
                  <CampaignCard
                    key={campaign.uuid}
                    isVertical={true}
                    organization={organization}
                    campaign={campaign}
                  />
                );
              })}
            </div>
          </Col>
        </Row>

        {campaigns?.length < count ? (
          <Row>
            <Col className={styles.showMoreContainer}>
              <Button
                size="lg"
                variant="outline-dark"
                disabled={isLoading}
                onClick={handleShowMore}
              >
                Show more
              </Button>
            </Col>
          </Row>
        ) : null}
      </Container>
    </div>
  );
}
