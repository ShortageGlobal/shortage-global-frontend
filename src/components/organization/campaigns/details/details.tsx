import styles from './details.module.scss';
import { useMemo } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { ChevronsDown } from 'react-feather';
import { useAppSelector } from 'core/hooks';
import { selectOrganization } from 'core/store/slices/organization';
import { selectCampaign } from 'core/store/slices/campaign';
import { DeadlineCountdown } from 'components/organization/deadline-countdown/deadline-countdown';
import { ShareButton } from 'components/share/share-button';
import { ROOT_URL, REQUESTED_GOODS_CONTAINER_ID } from 'core/constants';

export function CampaignDetails() {
  const { organization } = useAppSelector(selectOrganization);
  const { campaign } = useAppSelector(selectCampaign);

  const shareUrl = useMemo(() => {
    return `${ROOT_URL}/${organization.slug}/campaigns/${campaign.slug}/${campaign.uuid}/`;
  }, [organization.slug, campaign.slug, campaign.uuid]);

  const shareText = useMemo(() => {
    return `Make an in-kind gift to ${organization.name}. Support the "${campaign.name}" campaign`;
  }, [organization.name, campaign.name]);

  return (
    <Container>
      <Row>
        <Col>
          <div className={styles.campaignDetails}>
            <div className={styles.textContent}>
              {/* deadline countdown */}
              {campaign?.deadline &&
              Date.now() < Number(new Date(campaign.deadline)) ? (
                <DeadlineCountdown deadline={campaign.deadline} />
              ) : null}

              {/* organization link */}
              <div className={classNames(styles.link, 'text-truncate')}>
                <Link
                  href={{
                    pathname: '/[organizationSlug]/',
                    query: { organizationSlug: organization.slug },
                  }}
                >
                  {organization.name}
                </Link>
              </div>

              {/* description */}
              {campaign.requested_goods ? (
                <div className={styles.description}>
                  {/* Title */}
                  <h2 className={styles.title}>
                    Support the &quot;
                    <span className={styles.campaignName}>{campaign.name}</span>
                    &quot; campaign with{' '}
                    <span className={styles.requestedGoods}>
                      {campaign.requested_goods}
                    </span>
                  </h2>

                  {/* Mission description */}
                  {campaign.mission_description ? (
                    <div className={styles.missionDescription}>
                      {campaign.mission_description}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <h5 className={styles.sectionHeader}>Ready to help?</h5>

              <div className={styles.actions}>
                <Link
                  href={`#${REQUESTED_GOODS_CONTAINER_ID}`}
                  passHref
                  legacyBehavior
                >
                  <Button size="lg" className={styles.checkGoodsButton}>
                    <span>Check out our top requests</span>
                    <ChevronsDown />
                  </Button>
                </Link>

                <ShareButton
                  url={shareUrl}
                  text={shareText}
                  disabled={organization.is_draft || !organization.is_verified}
                />
              </div>
            </div>

            {/* banner */}
            {campaign.banner ? (
              <div className={styles.banner}>
                <Image
                  alt=""
                  src={campaign.banner}
                  fill
                  className={styles.bannerImg}
                />
              </div>
            ) : null}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
