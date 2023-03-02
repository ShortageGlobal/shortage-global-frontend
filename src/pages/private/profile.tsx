import commonStyles from 'styles/pages/private/common.module.scss';
import { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import { accountLayout } from 'core/layouts';
import { BreadcrumbsPortal } from 'core/layouts/breadcrumbs-portal/breadcrumbs-portal';
import { wrapper } from 'core/store';
import {
  Breadcrumbs,
  getHomeCrumb,
  getProfileCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { ProfileForm } from 'components/profile-form/profile-form';
import type { NextPageWithLayout } from 'pages/_app';

const ProfilePage: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getProfileCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>Profile | Shortage</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <Row className={commonStyles.headerRow}>
        <Col>
          <h2 className={commonStyles.title}>Profile</h2>
        </Col>
      </Row>

      <ProfileForm />
    </>
  );
};

ProfilePage.getLayout = accountLayout;

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default ProfilePage;
