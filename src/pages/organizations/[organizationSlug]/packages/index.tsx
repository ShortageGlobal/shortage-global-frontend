import styles from 'styles/pages/package-registration.module.scss';
import { useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Row, Col } from 'react-bootstrap';
import * as gtm from 'core/tracking/gtm';
import { wrapper } from 'core/store';
import { useAppSelector, useCart } from 'core/hooks';
import {
  fetchOrganization,
  selectOrganization,
} from 'core/store/slices/organization';
import {
  Breadcrumbs,
  getHomeCrumb,
  getDonationDetailsCrumb,
  getOrganizationCrumb,
  getPackageRegistrationCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { PackageRegistrationForm } from 'components/package-registration-form/package-registration-form';
import { PAGE_KEY } from 'core/constants';
import type { NextPageWithLayout } from 'pages/_app';
import { LoadingMessage } from 'components/loading-message/loading-message';

const PackageRegistrationPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { organization } = useAppSelector(selectOrganization);
  const { cart, isCartReady, isDonationDetailsFilled } = useCart();

  const organizationCartItems = useMemo(() => {
    return cart?.items
      .filter((item) => item.product.organization.slug === organization.slug)
      .sort((a, b) => {
        if (b.created_at > a.created_at) {
          return 1;
        }
        return -1;
      });
  }, [cart, organization]);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getDonationDetailsCrumb(),
      getOrganizationCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getPackageRegistrationCrumb({
        organizationSlug: organization.slug,
        isActive: true,
      }),
    ];
  }, [organization]);

  // track page view
  useEffect(() => {
    gtm.trackPackageRegistrationView({
      organizationSlug: organization.slug,
    });
  }, []);

  const shouldRedirect = useMemo(() => {
    return isCartReady && !isDonationDetailsFilled;
  }, [isCartReady, isDonationDetailsFilled]);

  const shouldShowForm = useMemo(() => {
    return organizationCartItems?.length > 0 && !shouldRedirect;
  }, [organizationCartItems, shouldRedirect]);

  const shouldShowNoItemsMessage = useMemo(() => {
    return !shouldShowForm && !shouldRedirect && isCartReady;
  }, [shouldShowForm, shouldRedirect, isCartReady]);

  const shouldShowLoadingMessage = useMemo(() => {
    return !shouldShowForm && !shouldShowNoItemsMessage && !shouldRedirect;
  }, [shouldShowForm, shouldShowNoItemsMessage, shouldRedirect]);

  // redirect to Donation Details if they aren't filled yet
  useEffect(() => {
    if (shouldRedirect) {
      router.push({
        pathname: '/donation/details',
        query: {
          showDonationDetailsAlert: true,
          next: PAGE_KEY.PACKAGE_REGISTRATION,
          nextOrganizationSlug: organization.slug,
        },
      });
    }
  }, [shouldRedirect]);

  return (
    <>
      <Head>
        <title>Register package for {organization.name} | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
        <Row>
          <Col className={styles.packageRegistration}>
            <h2 className={styles.header}>
              Register package for {organization.name}
            </h2>

            {isCartReady && !isDonationDetailsFilled ? (
              <LoadingMessage className={styles.loadingMessage}>
                <span>
                  Redirecting to{' '}
                  <Link
                    href={{
                      pathname: '/donation/details',
                      query: {
                        showDonationDetailsAlert: true,
                        next: PAGE_KEY.PACKAGE_REGISTRATION,
                        nextOrganizationSlug: organization.slug,
                      },
                    }}
                  >
                    Donation Details
                  </Link>
                </span>
              </LoadingMessage>
            ) : null}

            {shouldShowLoadingMessage ? (
              <LoadingMessage className={styles.loadingMessage}>
                <span>Loading data...</span>
              </LoadingMessage>
            ) : null}

            {shouldShowNoItemsMessage ? (
              <p className={styles.noItemsMessage}>
                Your donation cart doesn&apos;t have any goods requested by the
                organization. Check the requested goods on{' '}
                <Link
                  href={{
                    pathname: '/organizations/[organizationSlug]',
                    query: { organizationSlug: organization.slug },
                  }}
                >
                  the organization&apos;s page
                </Link>
                .
              </p>
            ) : null}

            {shouldShowForm ? (
              <PackageRegistrationForm
                organization={organization}
                items={organizationCartItems}
              />
            ) : null}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const organizationSlug = context.params.organizationSlug as string;

    await Promise.all([
      store.dispatch(fetchOrganization({ organizationSlug })),
    ]);

    const { organization } = store.getState();

    if (organization.error?.status === 404) {
      return {
        notFound: true,
      };
    }

    return {
      props: {},
    };
  }
);

export default PackageRegistrationPage;
