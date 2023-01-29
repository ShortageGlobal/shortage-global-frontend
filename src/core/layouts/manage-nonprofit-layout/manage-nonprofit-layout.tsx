import styles from './manage-nonprofit-layout.module.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { commonNonprofitLayout } from 'core/layouts/common-nonprofit-layout';
import { ManageNonprofitNav } from 'components/manage-nonprofit-nav/manage-nonprofit-nav';
import { BREADCRUMBS_PORTAL_ID } from 'core/constants';
import type { ReactElement } from 'react';

export const manageNonprofitLayout = (page: ReactElement) => {
  return commonNonprofitLayout(
    <Container>
      <Row>
        <Col
          id={BREADCRUMBS_PORTAL_ID}
          className={styles.breadcrumbsPortal}
        ></Col>
      </Row>

      <Row>
        <Col md={3}>
          <ManageNonprofitNav />
        </Col>
        <Col md={9}>{page}</Col>
      </Row>
    </Container>
  );
};
