import styles from './promoted-organizations.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'react-bootstrap';
import { useAppSelector } from 'app/hooks';
import { selectPromotedOrganizations } from 'app/store/slices/promoted-organizations';
import { SectionHeader } from 'components/section-header/section-header';

export function PromotedOrganizations() {
  const { organizations } = useAppSelector(selectPromotedOrganizations);

  return (
    <Container>
      <Row>
        <Col>
          <div className={styles.promotedOrganizations}>
            <SectionHeader>Our nonprofit partners</SectionHeader>
            <ul className={styles.organizationsList}>
              {organizations
                .filter((organization) => organization.photo)
                .map((organization) => {
                  return (
                    <li key={organization.slug}>
                      <Link
                        href={{
                          pathname: '/organizations/[organizationSlug]',
                          query: { organizationSlug: organization.slug },
                        }}
                      >
                        <a className={styles.organizationLink}>
                          <Image
                            src={organization.photo}
                            alt={organization.name}
                            layout="fill"
                            objectFit="contain"
                          />
                        </a>
                      </Link>
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
