import styles from 'styles/pages/account/create-account.module.scss';
import { useMemo, useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { wrapper } from 'core/store';
import { extractAccessTokenFromSession } from 'core/helpers';
import { fetchProfile } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getForNonprofitsCrumb,
  getForNonprofitsJoinCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { CreateAccountForm } from 'components/create-account-form/create-account-form';
import type { NextPageWithLayout } from 'pages/_app';

const CreateAccount: NextPageWithLayout = () => {
  const session = useSession();
  const router = useRouter();

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getForNonprofitsCrumb(),
      getForNonprofitsJoinCrumb({ isActive: true }),
    ];
  }, []);

  const isAuthenticated = useMemo(
    () => session?.status === 'authenticated',
    [session?.status]
  );

  const [isRegistered, setIsRegistered] = useState(false);

  // redirect from create account page if authenticated
  useEffect(() => {
    if (session?.status === 'authenticated') {
      const callbackUrl = router?.query?.callbackUrl || '/';
      const url = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;
      router.replace(url);
    }
  }, [isAuthenticated, router?.query?.callbackUrl]);

  return (
    <>
      <Head>
        <title>Create New Account | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      {isRegistered ? (
        <Container className={styles.registrationSuccessContainer}>
          <Row>
            <Col>
              <h2 className={styles.header}>Just a few more steps 💚</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>We&apos;re excited to see you join the Shortage community.</p>

              <p>
                We sent you <strong>a confirmation email</strong>, it will be in
                your inbox shortly. After confirmation you will be able to sign
                in to your account.
              </p>

              <p>
                If you didn&apos;t receive the email, please check your Spam
                folder.
              </p>

              <p>
                <strong>Come back to this page after signing in</strong> to
                register your nonprofit page.
              </p>

              <div className="d-flex justify-content-center">
                <Link href="/private/manage-nonprofit/" passHref legacyBehavior>
                  <Button variant="outline-dark" className={styles.dismissBtn}>
                    Already activated account?
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container className={styles.accountFormContainer}>
          <Row>
            <Col>
              <h2 className={styles.header}>Create New Account</h2>
            </Col>
          </Row>

          <CreateAccountForm
            onRegistered={() => setIsRegistered(true)}
            signInCallbackUrl="/private/manage-nonprofit/"
          />
        </Container>
      )}
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  () => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });

    // fetch profile and redirect to managing nonprofit if it exists
    try {
      await fetchProfile({ accessToken });
      return {
        redirect: {
          destination: `/private/manage-nonprofit/`,
          permanent: false,
        },
      };
    } catch (rejection) {
      // if 401 -> show create account form
    }

    return {
      props: {},
    };
  }
);

export default CreateAccount;
