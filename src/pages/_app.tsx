import 'styles/globals.scss';
import { useEffect, useRef } from 'react';
import SSRProvider from 'react-bootstrap/SSRProvider';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import NProgress from 'nprogress';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { Jost } from '@next/font/google';
import { wrapper } from 'core/store';
import { commonLayout } from 'core/layouts';
import * as gtm from 'core/tracking/gtm';
import {
  IS_STAGING,
  GOOGLE_TAG_MANAGER_ID,
  GOOGLE_TAG_MANAGER_SCRIPT_SRC_EXTRA,
  CLIENT_SESSION_REFETCH_INTERVAL,
} from 'core/constants';
import type { ReactElement, ReactNode } from 'react';
import type { Session } from 'next-auth';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

// import font
const jost = Jost({ subsets: ['latin'] });

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session }> & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const router = useRouter();

  // Let Google Tag Manager know about page change.
  // As an alternative we can use History Change tag
  useEffect(() => {
    router.events.on('routeChangeComplete', gtm.trackPageView);
    return () => {
      router.events.off('routeChangeComplete', gtm.trackPageView);
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
  const getLayout = Component.getLayout || commonLayout;

  const faviconHref = IS_STAGING ? '/favicon_staging.png' : '/favicon.png';

  return (
    <>
      <Head>
        <meta
          property="description"
          key="description"
          content="Shortage is a peer-to-peer donation marketplace. It is a whole ecosystem around in-kind donations - a network of medium and small nonprofit partners, online stores, producers of goods, and post companies. Individuals can buy requested GOODS through the platform or send what they already have directly to charities they trust. The platform allows sending an automated receipt for the tax deduction, uploading photos/videos of the delivery and its use, and encouraging donors to share these photos on social media."
        />

        {/* for sharing  */}
        <meta property="og:site_name" key="og:site_name" content="Shortage" />
        <meta property="og:type" key="og:type" content="website" />
        <meta
          property="og:url"
          key="og:url"
          content="https://shortage.global"
        />
        <meta
          property="og:title"
          key="og:title"
          content="Join Shortage and make in-kind donations to nonprofit organizations you trust"
        />
        <meta
          property="og:description"
          key="og:description"
          content="Shortage is a peer-to-peer donation marketplace. It is a whole ecosystem around in-kind donations - a network of medium and small nonprofit partners, online stores, producers of goods, and post companies. Individuals can buy requested GOODS through the platform or send what they already have directly to charities they trust. The platform allows sending an automated receipt for the tax deduction, uploading photos/videos of the delivery and its use, and encouraging donors to share these photos on social media."
        />
        <meta
          property="og:image"
          key="og:image"
          content="https://shortage.global/social_media_sharing_baner.png"
        />
        <meta property="og:image:width" key="og:image:width" content="1200" />
        <meta property="og:image:height" key="og:image:height" content="630" />
        <meta
          property="og:image:type"
          key="og:image:type"
          content="image/png"
        />

        <title>
          Join Shortage and make in-kind donations to nonprofit organizations
          you trust
        </title>
        <link rel="icon" href={faviconHref} />
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

      {/* define font variable */}
      <style jsx global>{`
        :root {
          --jost-font: ${jost.style.fontFamily};
        }
      `}</style>

      {/* Google Tag Manager - Global base code */}
      <Script
        id="gtag-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function (w, d, s, l, i) {
              w[l] = w[l] || [];
              w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
              var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
              j.async = true;
              j.src =
                'https://www.googletagmanager.com/gtm.js?id=' +
                i +
                dl +
                '${GOOGLE_TAG_MANAGER_SCRIPT_SRC_EXTRA}';
              f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', '${GOOGLE_TAG_MANAGER_ID}');
          `,
        }}
      />

      <SSRProvider>
        <SessionProvider
          session={session}
          refetchInterval={CLIENT_SESSION_REFETCH_INTERVAL}
        >
          <ThemeProvider
            breakpoints={['xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
            minBreakpoint="xxs"
          >
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </SessionProvider>
      </SSRProvider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
