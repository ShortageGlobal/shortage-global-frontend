import styles from './promoted-organizations.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'react-bootstrap';
import type { OrganizationPreview } from 'app/api/types';

export function PromotedOrganizations({
  organizations,
}: {
  organizations: OrganizationPreview[];
}) {
  return (
    <Container>
      <Row>
        <Col>
          <div className={styles.promotedOrganizations}>
            <h4 className={styles.heading}>Our Partners</h4>
            <ul className={styles.organizationsList}>
              {organizations
                .filter((organization) => organization.photo)
                .map((organization) => {
                  return (
                    <li key={organization.slug}>
                      <Link href={`/organizations/${organization.slug}/`}>
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
