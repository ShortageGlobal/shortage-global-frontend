import styles from './details.module.scss';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { ChevronsDown } from 'react-feather';
import { useAppSelector } from 'core/hooks';
import { selectOrganization } from 'core/store/slices/organization';
import { stripProtocolFromUrl } from 'core/helpers';
import { REQUESTED_GOODS_CONTAINER_ID } from 'core/constants';

export function OrganizationDetails() {
  const { organization } = useAppSelector(selectOrganization);

  return (
    <Container>
      <Row>
        <Col>
          <div className={styles.organizationDetails}>
            <div className={styles.textContent}>
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
              {organization.description ? (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: organization.description }}
                ></div>
              ) : null}

              <h5 className={styles.sectionHeader}>Ready to donate?</h5>

              <Link
                href={`#${REQUESTED_GOODS_CONTAINER_ID}`}
                passHref
                legacyBehavior
              >
                <Button size="lg" className={styles.checkGoodsButton}>
                  <span>Check Out Our Top Requests</span>
                  <ChevronsDown />
                </Button>
              </Link>
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
