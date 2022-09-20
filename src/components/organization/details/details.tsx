import styles from './details.module.scss';
import Image from 'next/image';
import { ArrowRightCircle } from 'react-feather';
import { Col, Container, Row } from 'react-bootstrap';
import { useAppSelector } from 'app/hooks';
import { selectOrganization } from 'app/store/slices/organization';
import { stripProtocolFromUrl } from 'app/helpers';

export function OrganizationDetails() {
  const { organization } = useAppSelector(selectOrganization);

  console.log(organization);

  return (
    <Container>
      <Row>
        <Col>
          <div className={styles.organizationDetails}>
            {/* photo as link */}
            {organization.photo && organization.url ? (
              <a
                href={organization.url}
                className={styles.photo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={organization.photo}
                  layout="fill"
                  objectFit="contain"
                />
              </a>
            ) : null}

            {/* photo without link */}
            {organization.photo && !organization.url ? (
              <div className={styles.photo}>
                <Image
                  src={organization.photo}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            ) : null}

            {/* link */}
            {organization.url ? (
              <div className="text-truncate">
                <a
                  className={styles.link}
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
          </div>
          {organization.tax_form_url ? (
            <a
              href={organization.tax_form_url}
              className={styles.taxDeductionFormLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>To receive tax deduction receipt please fill the form</span>
              <ArrowRightCircle />
            </a>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
}
