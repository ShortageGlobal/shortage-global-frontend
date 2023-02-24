import { wrapper } from 'core/store';
import { extractAccessTokenFromSession } from 'core/helpers';
import { fetchAccountOrganization } from 'core/store/slices/account-organization';
import type { NextPageWithLayout } from 'pages/_app';

// redirect based on the organization state
const NonprofitRedirectorPage: NextPageWithLayout = () => {
  return null;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });
    const organizationSlug = context.params.organizationSlug as string;

    await store.dispatch(
      fetchAccountOrganization({ organizationSlug, accessToken })
    );

    const { accountOrganization } = store.getState();

    if (accountOrganization.error?.status === 404) {
      return {
        redirect: {
          destination: '/private/manage-nonprofit/',
          permanent: false,
        },
      };
    }

    if (accountOrganization.error?.status === 401) {
      const callbackUrl = encodeURIComponent(context.resolvedUrl);
      return {
        redirect: {
          destination: `/account/sign-in/?callbackUrl=${callbackUrl}`,
          permanent: false,
        },
      };
    }

    const isVerified = accountOrganization.organization?.is_verified;

    // Redirect to either "Donations" or "Nonprofit Page"
    // There were problems with redux store hydration if I used `next.config.js` redirects.
    return {
      redirect: {
        destination: isVerified
          ? `/private/manage-nonprofit/${organizationSlug}/donations/`
          : `/private/manage-nonprofit/${organizationSlug}/page/`,
        permanent: false,
      },
    };
  }
);

export default NonprofitRedirectorPage;
