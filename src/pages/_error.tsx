import styles from 'styles/pages/error.module.scss';
import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';

const statusCodes: { [code: number]: string } = {
  400: 'Bad Request',
  404: 'This page could not be found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
};

/**
 * `Error` component used for handling errors.
 */
const Error = ({ statusCode }: { statusCode: number }) => {
  const title = statusCodes[statusCode] || 'An unexpected error has occurred';

  return (
    <>
      <Head>
        <title>
          {statusCode ? `${statusCode}: ${title}` : title} | Shortage
        </title>
      </Head>
      <div className={styles.errorPage}>
        <div className={styles.errorMessage}>
          {statusCode ? (
            <span className={styles.statusCode}>{statusCode}</span>
          ) : null}
          <span>
            {title ? (
              title
            ) : (
              <>
                Application error: a client-side exception has occurred (see the
                browser console for more information)
              </>
            )}
            .
          </span>
        </div>

        <Link
          href="/"
          className={classNames('btn btn-outline-dark', styles.homeButton)}
        >
          Get me to Homepage
        </Link>
      </div>
    </>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
