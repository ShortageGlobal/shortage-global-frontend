import styles from 'styles/pages/private/profile.module.scss';
import { useMemo, useEffect, useState } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { wrapper } from 'core/store';
import { fetchProfile } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getProfile,
} from 'components/breadcrumbs/breadcrumbs';
import type { NextPageWithLayout } from 'pages/_app';

const Profile: NextPageWithLayout = () => {
  const session = useSession();

  const [profile, setProfile] = useState(null);

  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getProfile({ isActive: true })];
  }, []);

  // fetch profile
  useEffect(() => {
    if (session.status === 'authenticated' && !profile) {
      (async function fetchData() {
        const response = await fetchProfile();
        setProfile(response.data);
      })();
    }
  }, [session.status, profile]);

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

      <Container className={styles.profile}>
        <Row>
          <Col>
            <h2 className={styles.header}>
              <span>Profile</span>{' '}
              <Badge bg="warning" className={styles.badge}>
                BETA
              </Badge>
            </h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <pre>{JSON.stringify(profile, undefined, 2)}</pre>
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

export default Profile;
