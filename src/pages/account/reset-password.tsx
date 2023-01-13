import styles from 'styles/pages/account/reset-password.module.scss';
import animationStyles from 'styles/animations.module.scss';
import classNames from 'classnames';
import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Alert,
} from 'react-bootstrap';
import { Loader, Eye, EyeOff } from 'react-feather';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import { wrapper } from 'core/store';
import { confirmPasswordReset, checkPasswordResetToken } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getForgotPasswordCrumb,
  getResetPasswordCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { FormEvent } from 'react';
import type { NextPageWithLayout } from 'pages/_app';

const INPUT_ID = Object.freeze({
  newPassword: 'newPassword',
  confirmPassword: 'confirmPassword',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.newPassword]: 'new_password',
  [INPUT_ID.confirmPassword]: 'confirm_password',
});
type ErrorKey = typeof ERROR_KEYS[keyof typeof ERROR_KEYS];

type ResetPasswordPageProps = {
  isTokenValid: boolean;
};

const ResetPasswordPage: NextPageWithLayout = ({
  isTokenValid,
}: ResetPasswordPageProps) => {
  const { showNotification } = useNotifications();
  const session = useSession();
  const router = useRouter();

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getForgotPasswordCrumb(),
      getResetPasswordCrumb({ isActive: true }),
    ];
  }, []);

  const isAuthenticated = useMemo(
    () => session?.status === 'authenticated',
    [session?.status]
  );

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const getResetPasswordCancelToken = useCancelToken();

  // redirect from the "Reset Password" page if authenticated
  useEffect(() => {
    if (session?.status === 'authenticated') {
      const callbackUrl = router?.query?.callbackUrl || '/';
      const url = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;
      router.replace(url);
    }
  }, [isAuthenticated, router?.query?.callbackUrl]);

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isPending || isAuthenticated) {
        return;
      }

      setIsPending(true);

      const cancelToken = getResetPasswordCancelToken();

      // use form instead of state because of problems with autofill
      const target = e.target as typeof e.target & {
        [INPUT_ID.newPassword]: HTMLInputElement;
        [INPUT_ID.confirmPassword]: HTMLInputElement;
      };

      try {
        await confirmPasswordReset({
          newPassword: target[INPUT_ID.newPassword].value,
          confirmPassword: target[INPUT_ID.confirmPassword].value,
          uid: router.query?.uid as string,
          token: router.query?.token as string,
          cancelToken,
        });

        setErrors(null);
        setIsPending(false);
        setIsPasswordReset(true);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsPending(false);

        const rejectionErrors = rejection?.response?.data;
        if (rejectionErrors) {
          setErrors(rejectionErrors);
        } else {
          setErrors(null);
          showNotification({
            isFailure: true,
            message: 'Failed to reset password',
          });
        }
      }
    },
    [isPending, isAuthenticated, showNotification, router.query]
  );

  const handleSignIn = useCallback(() => {
    router.push({
      pathname: '/account/sign-in/',
    });
  }, [router]);

  const getIsValid = (key: ErrorKey) =>
    !(errors?.[key]?.length > 0) && errors !== null;
  const getIsInvalid = (key: ErrorKey) => errors?.[key]?.length > 0;
  const getErrorsFeedback = (key: ErrorKey) =>
    errors?.[key]?.map((errorMessage) => {
      return (
        <Form.Control.Feedback key={errorMessage} type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      );
    });

  return (
    <>
      <Head>
        <title>Reset Password | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container className={styles.accountFormContainer}>
        <Row>
          <Col>
            <h2 className={styles.header}>Reset Password</h2>
          </Col>
        </Row>

        {isTokenValid && !isPasswordReset ? (
          <Form onSubmit={handleFormSubmit} className={styles.form}>
            <Row>
              <Form.Group
                as={Col}
                controlId={INPUT_ID.newPassword}
                className={styles.formGroup}
              >
                <Form.Label>New Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    size="lg"
                    type={showPassword ? 'test' : 'password'}
                    name="password"
                    required
                    isValid={getIsValid(ERROR_KEYS.newPassword)}
                    isInvalid={getIsInvalid(ERROR_KEYS.newPassword)}
                  />
                  <Button
                    variant=""
                    className={classNames(styles.showPasswordBtn, {
                      [styles.withFeedback]:
                        !!getIsInvalid(ERROR_KEYS.newPassword) ||
                        !!getIsValid(ERROR_KEYS.newPassword),
                    })}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                  {getErrorsFeedback(ERROR_KEYS.newPassword)}
                </InputGroup>
              </Form.Group>
            </Row>

            <Row>
              <Form.Group
                as={Col}
                controlId={INPUT_ID.confirmPassword}
                className={styles.formGroup}
              >
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    size="lg"
                    type={showPassword ? 'test' : 'password'}
                    name="password"
                    required
                    isValid={getIsValid(ERROR_KEYS.confirmPassword)}
                    isInvalid={getIsInvalid(ERROR_KEYS.confirmPassword)}
                  />
                  <Button
                    variant=""
                    className={classNames(styles.showPasswordBtn, {
                      [styles.withFeedback]:
                        !!getIsInvalid(ERROR_KEYS.confirmPassword) ||
                        !!getIsValid(ERROR_KEYS.confirmPassword),
                    })}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                  {getErrorsFeedback(ERROR_KEYS.confirmPassword)}
                </InputGroup>
              </Form.Group>
            </Row>

            <Row>
              <Col>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending || isAuthenticated}
                  className={styles.submitBtn}
                >
                  {isPending ? (
                    <Loader
                      role="status"
                      aria-hidden="true"
                      className={animationStyles.rotate}
                    />
                  ) : null}
                  <span>Submit</span>
                </Button>
              </Col>
            </Row>
          </Form>
        ) : null}

        {!isTokenValid ? (
          <Alert variant="warning" className={styles.alert}>
            <p>
              The link is not valid. Perhaps, it has already been used to reset
              the password. You may reset the password again.
            </p>
            <Link href="/account/forgot-password/" legacyBehavior passHref>
              <Button>Reset password</Button>
            </Link>
          </Alert>
        ) : null}

        {isPasswordReset ? (
          <Alert variant="success" className={styles.alert}>
            <p>
              The new password has been successfully set. You can use it to sign
              in.
            </p>
            <Button onClick={handleSignIn}>Sign in</Button>
          </Alert>
        ) : null}
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  () => async (context) => {
    const uid = context.query.uid as string;
    const token = context.query.token as string;

    let isTokenValid = true;
    try {
      await checkPasswordResetToken({ uid, token });
    } catch (rejection) {
      isTokenValid = false;
    }

    return {
      props: { isTokenValid },
    };
  }
);

export default ResetPasswordPage;
