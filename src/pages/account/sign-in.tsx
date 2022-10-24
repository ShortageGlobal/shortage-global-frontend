import styles from 'styles/pages/account-form.module.scss';
import animationStyles from 'styles/animations.module.scss';
import classNames from 'classnames';
import { useMemo, useState, useCallback } from 'react';
import {
  Container,
  Row,
  Col,
  Alert,
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';
import { Loader, Eye, EyeOff } from 'react-feather';
import Head from 'next/head';
import { wrapper } from 'app/store';
import {
  Breadcrumbs,
  getHomeCrumb,
  getSignInCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { FormEvent } from 'react';
import type { NextPageWithLayout } from 'pages/_app';

const SignIn: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getSignInCrumb({ isActive: true })];
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isPending) {
        return;
      }

      setIsPending(true);

      try {
        // await signIn({ email, password });
      } catch (rejection) {
        if (rejection.response?.status === 401) {
          setErrorMessage(rejection.response.data.detail);
          setIsPending(false);
          return;
        }
      }
    },
    [email, password, isPending]
  );

  return (
    <>
      <Head>
        <title>Sign In | Shortage</title>
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
            <h2 className={styles.header}>Sign In</h2>
          </Col>
        </Row>

        <Form onSubmit={handleFormSubmit} className={styles.form}>
          <Row>
            <Form.Group as={Col} controlId="email" className={styles.formGroup}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                size="lg"
                type="email"
                placeholder=""
                required
                autoFocus
                value={email}
                isInvalid={!!errorMessage}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group
              as={Col}
              controlId="password"
              className={styles.formGroup}
            >
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  size="lg"
                  type={showPassword ? 'test' : 'password'}
                  placeholder=""
                  required
                  autoFocus
                  value={password}
                  isInvalid={!!errorMessage}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant=""
                  className={classNames(styles.showPasswordBtn, {
                    [styles.withError]: !!errorMessage,
                  })}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </InputGroup>
            </Form.Group>
          </Row>

          {errorMessage ? (
            <Row>
              <Col>
                <Alert variant="danger">{errorMessage}</Alert>
              </Col>
            </Row>
          ) : null}

          <Row>
            <Col>
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
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
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default SignIn;
