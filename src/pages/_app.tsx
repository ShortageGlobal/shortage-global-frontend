import 'styles/globals.scss';
import SSRProvider from 'react-bootstrap/SSRProvider';
import Head from 'next/head';
import { wrapper } from 'app/store';
import { Header } from 'components/header/header';
import { Footer } from 'components/footer/footer';
import { Cart } from 'components/cart/cart';
import { LiveChat } from 'components/live-chat/live-chat';
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
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <>
        <Header />
        <main className="main-container">{page}</main>
        <Footer />
        <Cart />
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
      <SSRProvider>{getLayout(<Component {...pageProps} />)}</SSRProvider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
