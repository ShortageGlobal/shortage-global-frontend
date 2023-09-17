import { wrapper } from 'core/store';
import { useAppSelector } from 'core/hooks';
import { fetchOrganization } from 'core/store/slices/organization';
import { fetchPackage, selectPackage } from 'core/store/slices/package';
import {
  fetchPackageBlogPosts,
  selectPackageBlogPosts,
} from 'core/store/slices/package-blog-posts';
import { extractAccessTokenFromSession } from 'core/helpers';
import { PermissionDenied } from 'components/permission-denied/permission-denied';
import { PackageStatus } from 'components/package-status/package-status';
import type { NextPageWithLayout } from 'pages/_app';

const PackagePage: NextPageWithLayout = () => {
  const packageState = useAppSelector(selectPackage);
  const packageBlogPosts = useAppSelector(selectPackageBlogPosts);

  if (
    packageState?.error?.status === 403 ||
    packageBlogPosts?.error?.status === 403
  ) {
    return <PermissionDenied />;
  }

  return <PackageStatus />;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const organizationSlug = context.params.organizationSlug as string;
    const packageId = context.params.packageId as string;

    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });

    await Promise.all([
      store.dispatch(fetchOrganization({ organizationSlug, accessToken })),
      store.dispatch(
        fetchPackage({ organizationSlug, packageId, accessToken })
      ),
      store.dispatch(
        fetchPackageBlogPosts({ organizationSlug, packageId, accessToken })
      ),
    ]);

    const {
      organization,
      package: packageState,
      packageBlogPosts,
    } = store.getState();

    if (
      organization.error?.status === 404 ||
      packageState.error?.status === 404 ||
      packageBlogPosts.error?.status === 404
    ) {
      return {
        notFound: true,
      };
    }

    if (
      packageState.error?.status === 401 ||
      packageBlogPosts.error?.status === 401
    ) {
      const callbackUrl = encodeURIComponent(context.resolvedUrl);
      return {
        redirect: {
          destination: `/account/sign-in/?callbackUrl=${callbackUrl}`,
          permanent: false,
        },
      };
    }

    if (
      packageState.error?.status === 403 ||
      packageBlogPosts.error?.status === 403
    ) {
      // we handle 403 status code on the client
    }

    return {
      props: {},
    };
  }
);

export default PackagePage;
