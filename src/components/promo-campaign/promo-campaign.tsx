import styles from './promo-campaign.module.scss';
import classNames from 'classnames';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { REQUESTED_GOODS_CONTAINER_ID } from 'core/constants';

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
            href={`#${REQUESTED_GOODS_CONTAINER_ID}`}
            className={styles.promoCampaign}
            style={{ backgroundImage: `url(${background})` }}
          >
            <span className={styles.text}>{text}</span>

            <span
              className={classNames(
                'btn btn-outline-primary',
                styles.checkRequestsButton
              )}
            >
              Check requests
            </span>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
