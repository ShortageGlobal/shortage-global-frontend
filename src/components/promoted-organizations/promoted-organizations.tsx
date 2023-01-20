import styles from './promoted-organizations.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'react-bootstrap';
import { useAppSelector } from 'core/hooks';
import { selectPromotedOrganizations } from 'core/store/slices/promoted-organizations';
import { selectPromotedExternalOrganizations } from 'core/store/slices/promoted-external-organizations';

export function PromotedOrganizations() {
  const { organizations } = useAppSelector(selectPromotedOrganizations);
  const { externalOrganizations } = useAppSelector(
    selectPromotedExternalOrganizations
  );

  return (
    <Container>
      <Row>
        <Col>
          <div className={styles.promotedOrganizations}>
            <ul className={styles.organizationsList}>
              {organizations
                .filter((organization) => organization.logo)
                .map((organization) => {
                  return (
                    <li key={organization.slug}>
                      <Link
                        href={{
                          pathname: '/[organizationSlug]/',
                          query: { organizationSlug: organization.slug },
                        }}
                        className={styles.organizationLink}
                      >
                        <Image
                          src={organization.logo}
                          alt={organization.name}
                          fill
                          className={styles.logoImg}
                        />
                      </Link>
                    </li>
                  );
                })}
              {externalOrganizations.map((organization) => {
                return (
                  <li key={organization.url}>
                    <a
                      href={organization.url}
                      className={styles.organizationLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Image
                        src={organization.logo}
                        alt={organization.name}
                        fill
                        className={styles.logoImg}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
