import styles from './details.module.scss';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { ChevronsDown } from 'react-feather';
import { useAppSelector } from 'app/hooks';
import { selectOrganization } from 'app/store/slices/organization';
import { stripProtocolFromUrl } from 'app/helpers';
import { REQUESTED_GOODS_CONTAINER_ID } from 'app/constants';

export function OrganizationDetails() {
  const { organization } = useAppSelector(selectOrganization);

  return (
    <Container>
      <Row>
        <Col>
          <div className={styles.organizationDetails}>
            <div className={styles.textContent}>
              {/* logo as link */}
              {organization.logo && organization.url ? (
                <a
                  href={organization.url}
                  className={styles.logo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    alt=""
                    src={organization.logo}
                    layout="fill"
                    objectFit="contain"
                  />
                </a>
              ) : null}

              {/* logo without link */}
              {organization.logo && !organization.url ? (
                <div className={styles.logo}>
                  <Image
                    alt=""
                    src={organization.logo}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
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
              {organization.description ? (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: organization.description }}
                ></div>
              ) : null}

              <h5 className={styles.sectionHeader}>Ready to donate?</h5>

              <Link href={`#${REQUESTED_GOODS_CONTAINER_ID}`} passHref>
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
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : null}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
