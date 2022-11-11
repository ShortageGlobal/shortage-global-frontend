import styles from './promo-campaign.module.scss';
import classNames from 'classnames';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';

type PromoCampaignProps = {
  text: string;
  background: string;
};

export function PromoCampaign({ background, text }: PromoCampaignProps) {
  return (
    <Container>
      <Row>
        <Col>
          <Link
            href={{
              pathname: '/organizations/[organizationSlug]/',
              query: { organizationSlug: 'JFCS' },
            }}
            className={styles.promoCampaign}
            style={{ backgroundImage: `url(${background})` }}
          >
            <span className={styles.text}>{text}</span>

            <span
              className={classNames(
                'btn btn-outline-primary',
                styles.actionButton
              )}
            >
              Make a Gift
            </span>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
