import { useMemo } from 'react';
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import Head from 'next/head';
import Link from 'next/link';
import { wrapper } from 'core/store';
import { extractAccessTokenFromSession } from 'core/helpers';
import { fetchAccountOrganizations } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getForNonprofitsCrumb,
  getManageNonprofitChooseCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { AccountOrganization } from 'core/api/types';
import type { NextPageWithLayout } from 'pages/_app';

type ChooseNonprofitPageProps = {
  organizations: AccountOrganization[];
};

const ChooseNonprofitPage: NextPageWithLayout = ({
  organizations,
}: ChooseNonprofitPageProps) => {
  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getForNonprofitsCrumb(),
      getManageNonprofitChooseCrumb({ isActive: true }),
    ];
  }, []);

  return (
    <>
      <Head>
        <title>Choose a nonprofit | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <div className="d-flex flex-grow-1 align-items-center justify-content-center m-5">
        <DropdownButton
          size="lg"
          variant="primary"
          title="Choose a nonprofit"
          drop="down-centered"
        >
          {organizations.map((organization) => {
            return (
              <Link
                key={organization.slug}
                href={{
                  pathname: `/private/manage-nonprofit/[organizationSlug]/`,
                  query: { organizationSlug: organization.slug },
                }}
                passHref
                legacyBehavior
              >
                <Dropdown.Item>{organization.name}</Dropdown.Item>
              </Link>
            );
          })}
        </DropdownButton>
      </div>
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

    // redirect to the only user's organization,
    // as we normally allow only one organization per account
    if (organizations?.length === 1) {
      return {
        redirect: {
          destination: `/private/manage-nonprofit/${organizations[0].slug}/`,
          permanent: false,
        },
      };
    }

    // redirect to the organization creation page
    if (organizations?.length === 0) {
      return {
        redirect: {
          destination: `/private/manage-nonprofit/register/`,
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

export default ChooseNonprofitPage;
