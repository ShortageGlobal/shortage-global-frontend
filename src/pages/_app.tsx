import 'styles/globals.scss';
import { useEffect, useRef } from 'react';
import SSRProvider from 'react-bootstrap/SSRProvider';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import NProgress from 'nprogress';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { wrapper } from 'app/store';
import { Header } from 'components/header/header';
import { Footer } from 'components/footer/footer';
import { CartSidebar } from 'components/cart/sidebar/cart-sidebar';
import { LiveChat } from 'components/live-chat/live-chat';
import * as gtag from 'app/tracking/gtag';
import * as fbq from 'app/tracking/fpixel';
import { GA_TRACKING_ID, FB_PIXEL_ID } from 'app/constants';
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

  // Google Analytics events
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

  // Facebook Pixel events
  useEffect(() => {
    // This pageview only triggers the first time (it's important for Pixel to have real information)
    fbq.pageview();

    const handleRouteChange = () => {
      fbq.pageview();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // configure router progress bar
  useEffect(() => {
    NProgress.configure({ showSpinner: false });
  }, []);

  // router progress bar events
  const basePath = useRef(router.pathname);
  useEffect(() => {
    const handleStart = (url) => {
      const [newBasePath] = url.split('?');
      if (newBasePath !== basePath.current) {
        // ignore changes in query parameters
        NProgress.start();
        basePath.current = newBasePath;
      }
    };

    const handleStop = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

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
        {/* for sharing  */}
        <meta property="og:url" content="https://shortage.global" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Shortage | Donate tangible goods" />
        <meta
          property="og:description"
          content="A place for you to donate goods directly to the charities that need it most"
        />
        <meta
          property="og:image"
          content="https://shortage.global/social_media_sharing_baner.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />

        <title>Shortage | Donate tangible goods</title>
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          name="facebook-domain-verification"
          content="n6iogeto9yr1xgqtzj2icomr1u84sp"
        />

        {/*
          manifest.json provides metadata used when your web app is installed on a
          user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
        */}
        <link rel="manifest" href="/manifest.json" />
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

      {/* Global Site Code Pixel - Facebook Pixel */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${FB_PIXEL_ID});
          `,
        }}
      />

      <SSRProvider>
        <ThemeProvider
          breakpoints={['xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
        >
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </SSRProvider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
