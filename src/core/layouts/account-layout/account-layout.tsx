import styles from './account-layout.module.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { commonDonorLayout } from 'core/layouts/common-donor-layout';
import { AccountNav } from 'components/account-nav/account-nav';
import { BREADCRUMBS_PORTAL_ID } from 'core/constants';
import type { ReactElement } from 'react';

export const accountLayout = (page: ReactElement) => {
  return commonDonorLayout(
    <Container>
      <Row>
        <Col id={BREADCRUMBS_PORTAL_ID} className={styles.breadcrumbsPortal} />
      </Row>

      <Row>
        <Col md={3}>
          <AccountNav />
        </Col>
        <Col md={9}>{page}</Col>
      </Row>
    </Container>
  );
};
