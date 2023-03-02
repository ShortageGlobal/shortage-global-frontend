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
  getChangePasswordCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { ChangePasswordForm } from 'components/change-password-form/change-password-form';
import type { NextPageWithLayout } from 'pages/_app';

const ChangePasswordPage: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getChangePasswordCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>Change Password | Shortage</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <Row className={commonStyles.headerRow}>
        <Col>
          <h2 className={commonStyles.title}>Change Password</h2>
        </Col>
      </Row>

      <Row>
        <Col>
          <ChangePasswordForm />
        </Col>
      </Row>
    </>
  );
};

ChangePasswordPage.getLayout = accountLayout;

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default ChangePasswordPage;
