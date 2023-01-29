import styles from './common.module.scss';
import { DonorHeader } from 'components/header/donor-header/donor-header';
import { AuthenticationGuard } from 'components/authentication-guard/authentication-guard';
import { Notifications } from 'components/notifications/notifications';
import { WeAreHereForYou } from 'components/we-are-here-for-you/we-are-here-for-you';
import { Footer } from 'components/footer/footer';
import { CartSidebar } from 'components/cart/sidebar/cart-sidebar';
import { LiveChat } from 'components/live-chat/live-chat';
import type { ReactElement } from 'react';

export const commonDonorLayout = (page: ReactElement) => {
  return (
    <>
      <DonorHeader />
      <main className={styles.mainContainer}>
        <AuthenticationGuard>{page}</AuthenticationGuard>
        <Notifications />
      </main>
      <WeAreHereForYou />
      <Footer />
      <CartSidebar />
      <LiveChat />
    </>
  );
};
