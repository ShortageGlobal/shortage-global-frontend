import styles from './details.module.scss';
import { useMemo } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { ChevronsDown } from 'react-feather';
import { useAppSelector } from 'core/hooks';
import { selectOrganization } from 'core/store/slices/organization';
import { stripProtocolFromUrl } from 'core/helpers';
import { DeadlineCountdown } from 'components/organization/deadline-countdown/deadline-countdown';
import { ShareButton } from 'components/share/share-button';
import { ROOT_URL, REQUESTED_GOODS_CONTAINER_ID } from 'core/constants';

export function OrganizationDetails() {
  const { organization } = useAppSelector(selectOrganization);

  const shareUrl = useMemo(() => {
    return `${ROOT_URL}/${organization.slug}/`;
  }, [organization.slug]);

  const shareText = useMemo(() => {
    return `Make an in-kind gift to ${organization.name}`;
  }, [organization.name]);

  return (
    <Container>
      <Row>
        <Col>
          <div className={styles.organizationDetails}>
            <div className={styles.textContent}>
              {/* deadline countdown */}
              {organization?.deadline &&
              Date.now() < Number(new Date(organization.deadline)) ? (
                <DeadlineCountdown deadline={organization.deadline} />
              ) : null}

              {/* link */}
              {organization.url ? (
                <div className={classNames(styles.link, 'text-truncate')}>
                  <a
                    href={organization.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {stripProtocolFromUrl(organization.url)}
                  </a>
                </div>
              ) : null}

              {/* description */}
              {organization.requested_goods ? (
                <div className={styles.description}>
                  {/* Title */}
                  <h2 className={styles.title}>
                    Support{' '}
                    <span className={styles.organizationName}>
                      {organization.name}
                    </span>{' '}
                    with{' '}
                    <span className={styles.requestedGoods}>
                      {organization.requested_goods}
                    </span>
                  </h2>

                  {/* Mission description */}
                  {organization.mission_description ? (
                    <div className={styles.missionDescription}>
                      {organization.mission_description}
                    </div>
                  ) : null}
                </div>
              ) : null}
              {!organization.requested_goods && organization.description ? (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: organization.description }}
                ></div>
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

            {/* logo as link */}
            {organization.banner ? (
              <div className={styles.banner}>
                <Image
                  alt=""
                  src={organization.banner}
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
