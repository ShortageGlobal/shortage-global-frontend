import styles from 'styles/pages/package-registration.module.scss';
import { useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { wrapper } from 'app/store';
import { useAppSelector, useCart } from 'app/hooks';
import {
  fetchOrganization,
  selectOrganization,
} from 'app/store/slices/organization';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
  getPackageRegistrationCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { PackageRegistrationForm } from 'components/package-registration-form/package-registration-form';
import { PAGE_KEY } from 'app/constants';
import type { NextPageWithLayout } from 'pages/_app';

const PackageRegistrationPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { organization } = useAppSelector(selectOrganization);
  const { cart, isCartReady, isDonationDetailsFilled } = useCart();

  const [initialCartItems, setInitialCartItems] = useState(null);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
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

  // redirect to Donation Details if they aren't filled yet
  useEffect(() => {
    if (isCartReady && !isDonationDetailsFilled) {
      router.push({
        pathname: '/donation/details',
        query: {
          showDonationDetailsAlert: true,
          next: PAGE_KEY.PACKAGE_REGISTRATION,
          nextOrganizationSlug: organization.slug,
        },
      });
    }
  }, [isCartReady, isDonationDetailsFilled]);

  // Select cart items for the organization and persist them,
  // so the registration form stays on screen after showing up
  useEffect(() => {
    if (initialCartItems !== null || !isCartReady) {
      return;
    }

    const cartItemsForOrganization = cart.items
      .filter((item) => item.product.organization.slug === organization.slug)
      .sort((a, b) => {
        if (b.created_at > a.created_at) {
          return 1;
        }
        return -1;
      });

    setInitialCartItems(cartItemsForOrganization);
  }, [initialCartItems, isCartReady, cart, organization]);

  const shouldRedirect = useMemo(() => {
    return isCartReady && !isDonationDetailsFilled;
  }, [isCartReady, isDonationDetailsFilled]);

  const shouldShowForm = useMemo(() => {
    return initialCartItems?.length > 0 && !shouldRedirect;
  }, [initialCartItems, shouldRedirect]);

  const shouldShowNoItemsMessage = useMemo(() => {
    return !shouldShowForm && !shouldRedirect && isCartReady;
  }, [shouldShowForm, shouldRedirect, isCartReady]);

  const shouldShowLoadingMessage = useMemo(() => {
    return !shouldShowForm && !shouldShowNoItemsMessage && !shouldRedirect;
  }, [shouldShowForm, shouldShowNoItemsMessage, shouldRedirect]);

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
            <h2 className="text-break">
              Register package for {organization.name}
            </h2>

            {isCartReady && !isDonationDetailsFilled ? (
              <div className={styles.loadingMessage}>
                <Spinner animation="border" role="status"></Spinner>
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
                    <a>Donation Details</a>
                  </Link>
                </span>
              </div>
            ) : null}

            {shouldShowLoadingMessage ? (
              <div className={styles.loadingMessage}>
                <Spinner animation="border" role="status"></Spinner>
                <span>Loading packages...</span>
              </div>
            ) : null}

            {shouldShowNoItemsMessage ? (
              <p className={styles.noItemsMessage}>
                You haven&apos;t added any products to your package for this
                organization. Check the requested goods on{' '}
                <Link
                  href={{
                    pathname: '/organizations/[organizationSlug]',
                    query: { organizationSlug: organization.slug },
                  }}
                >
                  <a>the organization&apos;s page</a>
                </Link>
                .
              </p>
            ) : null}

            {shouldShowForm ? (
              <PackageRegistrationForm
                organization={organization}
                initialCartItems={initialCartItems}
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
