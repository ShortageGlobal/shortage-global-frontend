import styles from './account-layout.module.scss';
import commonStyles from 'core/layouts/common.module.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { Header } from 'components/header/header';
import { AuthenticationGuard } from 'components/authentication-guard/authentication-guard';
import { Notifications } from 'components/notifications/notifications';
import { AccountNav } from 'components/account-nav/account-nav';
import { WeAreHereForYou } from 'components/we-are-here-for-you/we-are-here-for-you';
import { Footer } from 'components/footer/footer';
import { CartSidebar } from 'components/cart/sidebar/cart-sidebar';
import { LiveChat } from 'components/live-chat/live-chat';
import type { ReactElement } from 'react';

export const BREADCRUMBS_PORTAL_ID = 'account-breadcrumbs-portal';

export const accountLayout = (page: ReactElement) => (
  <>
    <Header />
    <main className={commonStyles.mainContainer}>
      <AuthenticationGuard>
        <Container>
          <Row>
            <Col
              id={BREADCRUMBS_PORTAL_ID}
              className={styles.breadcrumbsPortal}
            ></Col>
          </Row>

          <Row>
            <Col md={3}>
              <AccountNav />
            </Col>
            <Col md={9}>{page}</Col>
          </Row>
        </Container>
        <Notifications />
      </AuthenticationGuard>
    </main>
    <WeAreHereForYou />
    <Footer />
    <CartSidebar />
    <LiveChat />
  </>
);
