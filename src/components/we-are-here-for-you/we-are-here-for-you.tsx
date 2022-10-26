import styles from './we-are-here-for-you.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import { useCallback } from 'react';
import Image from 'next/image';
import * as fbq from 'app/tracking/fpixel';
import { useAppDispatch } from 'app/hooks';
import { toggleLiveChat } from 'app/store/slices/live-chat';

export function WeAreHereForYou() {
  const dispatch = useAppDispatch();
  const handleSupportTeamClick = useCallback(() => {
    dispatch(toggleLiveChat());
    fbq.event('Contact', { content_name: 'LiveChat' });
  }, []);

  return (
    <Container className={styles.weAreHereForYou}>
      <Row className="justify-content-center">
        <Col className={styles.content}>
          <h2 className={styles.header}>We are here for you</h2>
          <p>
            If you have any questions or would like more information, please
            reach out to our wonderful{' '}
            <span
              role="button"
              className={styles.supportTeamBtn}
              onClick={handleSupportTeamClick}
            >
              support team
            </span>{' '}
            who will be happy to help you.
          </p>
        </Col>

        <Col xs="auto">
          <div className={styles.imageContainer}>
            <Image
              alt=""
              src="/images/characters/woman-sits-looks-left.svg"
              layout="fill"
              width="326"
              height="243"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
