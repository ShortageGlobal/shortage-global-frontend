import 'styles/globals.scss';

import type { ReactElement, ReactNode } from 'react';
import SSRProvider from 'react-bootstrap/SSRProvider';
import Head from 'next/head';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { wrapper } from 'app/store';
import { Header } from 'components/header/header';
import { Footer } from 'components/footer/footer';

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
      </>
    ));

  return (
    <>
      <Head>
        <title>ShortageGlobal | Donate tangible goods</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SSRProvider>{getLayout(<Component {...pageProps} />)}</SSRProvider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
