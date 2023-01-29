import styles from './common.module.scss';
import { NonprofitHeader } from 'components/header/nonprofit-header/nonprofit-header';
import { AuthenticationGuard } from 'components/authentication-guard/authentication-guard';
import { Notifications } from 'components/notifications/notifications';
import { WeAreHereForYou } from 'components/we-are-here-for-you/we-are-here-for-you';
import { Footer } from 'components/footer/footer';
import { LiveChat } from 'components/live-chat/live-chat';
import type { ReactElement } from 'react';

export const commonNonprofitLayout = (page: ReactElement) => {
  return (
    <>
      <NonprofitHeader />
      <main className={styles.mainContainer}>
        <AuthenticationGuard>{page}</AuthenticationGuard>
        <Notifications />
      </main>
      <WeAreHereForYou />
      <Footer />
      <LiveChat />
    </>
  );
};
