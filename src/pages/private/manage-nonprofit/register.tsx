import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import { wrapper } from 'core/store';
import { extractAccessTokenFromSession } from 'core/helpers';
import { fetchAccountOrganizations } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getManageNonprofitRegisterCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { RegisterNonprofitForm } from 'components/manage-nonprofit/register-nonprofit-form/register-nonprofit-form';
import type { NextPageWithLayout } from 'pages/_app';

const RegisterNonprofitPage: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getManageNonprofitRegisterCrumb({ isActive: true }),
    ];
  }, []);

  return (
    <>
      <Head>
        <title>Register a nonprofit | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <RegisterNonprofitForm />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  () => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });

    let organizations;

    // fetch user's organizations
    try {
      const response = await fetchAccountOrganizations({ accessToken });
      organizations = response.data;
    } catch (rejection) {
      if (rejection?.response?.status === 404) {
        return {
          notFound: true,
        };
      }

      if (rejection?.response?.status === 401) {
        const callbackUrl = encodeURIComponent(context.resolvedUrl);
        return {
          redirect: {
            destination: `/account/sign-in/?callbackUrl=${callbackUrl}`,
            permanent: false,
          },
        };
      }

      throw rejection;
    }

    // prevent registering a nonprofit if account has one already
    if (organizations?.length > 0) {
      return {
        redirect: {
          destination: `/private/manage-nonprofit/`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        organizations,
      },
    };
  }
);

export default RegisterNonprofitPage;
