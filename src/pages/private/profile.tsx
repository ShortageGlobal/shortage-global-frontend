import styles from 'styles/pages/account-form.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import { wrapper } from 'app/store';
import {
  Breadcrumbs,
  getHomeCrumb,
  getProfile,
} from 'components/breadcrumbs/breadcrumbs';
import type { NextPageWithLayout } from 'pages/_app';

const SignIn: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getProfile({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>Profile | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col>
            <h2 className={styles.header}>Profile</h2>
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

export default SignIn;
