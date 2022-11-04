import styles from 'styles/pages/account/activate.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { wrapper } from 'core/store';
import { isRequestCancel } from 'core/hooks';
import { confirmAccount } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getCreateAccountCrumb,
  getConfirmAccountCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { NextPageWithLayout } from 'pages/_app';

const ConfirmAccount: NextPageWithLayout = () => {
  const router = useRouter();

  const [isPending, setIsPending] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getCreateAccountCrumb(),
      getConfirmAccountCrumb({ isActive: true }),
    ];
  }, []);

  // send activation request
  useEffect(() => {
    // get uid and token from query params
    const uid = Array.isArray(router.query.uid)
      ? router.query.uid[0]
      : router.query.uid;
    const token = Array.isArray(router.query.token)
      ? router.query.token[0]
      : router.query.token;

    // send a request
    (async function () {
      try {
        await confirmAccount({ uid, token });
        setIsSuccessful(true);
        setIsPending(false);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsFailed(true);
        setIsPending(false);
      }
    })();
  }, []);

  const handleSignIn = useCallback(() => {
    router.push({
      pathname: '/account/sign-in/',
    });
  }, [router]);

  return (
    <>
      <Head>
        <title>Confirm Account | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container className={styles.confirmAccount}>
        <Row>
          <Col>
            <h2 className={styles.header}>Confirm Account</h2>
          </Col>
        </Row>

        <Row>
          <Col className={styles.content}>
            {isPending ? (
              <div className={styles.loadingMessage}>
                <Loader
                  role="status"
                  aria-hidden="true"
                  className={animationStyles.rotate}
                />
                <span>Please wait...</span>
              </div>
            ) : null}

            {isSuccessful ? (
              <div>
                <Alert variant="success">
                  <p>
                    Account has been successfully activated. You can sign in
                    using your credentials now.
                  </p>
                  <Button onClick={handleSignIn}>Sign in</Button>
                </Alert>
              </div>
            ) : null}

            {isFailed ? (
              <div>
                <Alert variant="warning">
                  <p>
                    The link is not valid. Perhaps, the account has already been
                    activated. Try signing in and contact support if there is a
                    problem.
                  </p>
                  <Button onClick={handleSignIn}>Sign in</Button>
                </Alert>
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default ConfirmAccount;
