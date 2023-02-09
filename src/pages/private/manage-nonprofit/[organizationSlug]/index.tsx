import { wrapper } from 'core/store';
import type { NextPageWithLayout } from 'pages/_app';

// redirect based on the organization state
const NonprofitRedirectorPage: NextPageWithLayout = () => {
  return null;
};

export const getServerSideProps = wrapper.getServerSideProps(
  () => async (context) => {
    const organizationSlug = context.params.organizationSlug as string;

    // Redirect to Nonprofit Page page.
    // There were problems with redux store hydration if I used `next.config.js` redirects.
    return {
      redirect: {
        destination: `/private/manage-nonprofit/${organizationSlug}/page/`,
        permanent: false,
      },
    };
  }
);

export default NonprofitRedirectorPage;
