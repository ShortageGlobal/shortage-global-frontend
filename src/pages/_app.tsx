import 'styles/globals.scss';
import { useEffect } from 'react';
import SSRProvider from 'react-bootstrap/SSRProvider';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { wrapper } from 'app/store';
import { Header } from 'components/header/header';
import { Footer } from 'components/footer/footer';
import { CartSidebar } from 'components/cart/sidebar/cart-sidebar';
import { LiveChat } from 'components/live-chat/live-chat';
import * as gtag from 'app/gtag';
import { GA_TRACKING_ID } from 'app/constants';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <>
        <Header />
        <main className="main-container">{page}</main>
        <Footer />
        <CartSidebar />
        <LiveChat />
      </>
    ));

  return (
    <>
      <Head>
        <title>Shortage | Donate tangible goods</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      <SSRProvider>{getLayout(<Component {...pageProps} />)}</SSRProvider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
