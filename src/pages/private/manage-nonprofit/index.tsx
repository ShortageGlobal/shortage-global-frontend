import { wrapper } from 'core/store';
import { extractAccessTokenFromSession } from 'core/helpers';
import { fetchAccountOrganizations } from 'core/api';
import type { NextPageWithLayout } from 'pages/_app';

// redirect based on the user's organizations
const ManageNonprofitRedirectorPage: NextPageWithLayout = () => {
  return null;
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

    // redirect to the organization chooser
    // will be usefull for admin accounts that can own more than one organization
    if (organizations?.length > 1) {
      return {
        redirect: {
          destination: `/private/manage-nonprofit/choose/`,
          permanent: false,
        },
      };
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

    return {
      redirect: {
        destination: `/private/manage-nonprofit/register/`,
        permanent: false,
      },
    };
  }
);

export default ManageNonprofitRedirectorPage;
