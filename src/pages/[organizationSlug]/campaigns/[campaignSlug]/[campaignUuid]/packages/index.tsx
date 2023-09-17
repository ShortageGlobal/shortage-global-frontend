import styles from 'styles/pages/package-registration.module.scss';
import { useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import * as gtm from 'core/tracking/gtm';
import { wrapper } from 'core/store';
import { useAppSelector, useCart } from 'core/hooks';
import { extractAccessTokenFromSession } from 'core/helpers';
import {
  fetchOrganization,
  selectOrganization,
} from 'core/store/slices/organization';
import { fetchCampaign, selectCampaign } from 'core/store/slices/campaign';
import {
  Breadcrumbs,
  getHomeCrumb,
  getDonationDetailsCrumb,
  getOrganizationCrumb,
  getCampaignCrumb,
  getCampaignPackageRegistrationCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { PackageRegistrationForm } from 'components/package-registration-form/package-registration-form';
import { PAGE_KEY } from 'core/constants';
import type { NextPageWithLayout } from 'pages/_app';
import { LoadingMessage } from 'components/loading-message/loading-message';

const CampaignPackageRegistrationPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { organization } = useAppSelector(selectOrganization);
  const { campaign } = useAppSelector(selectCampaign);
  const { cart, isCartReady, isDonationDetailsFilled } = useCart();

  const campaignCartItems = useMemo(() => {
    return cart?.items
      .filter(
        (item) =>
          item.product.organization.slug === organization.slug &&
          item.campaign?.slug === campaign.slug &&
          item.campaign?.uuid === campaign.uuid
      )
      .sort((a, b) => {
        if (b.created_at > a.created_at) {
          return 1;
        }
        return -1;
      });
  }, [cart, organization, campaign]);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getDonationDetailsCrumb(),
      getOrganizationCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getCampaignCrumb({
        organizationSlug: organization.slug,
        campaignSlug: campaign.slug,
        campaignUuid: campaign.uuid,
        campaignName: campaign.name,
      }),
      getCampaignPackageRegistrationCrumb({
        organizationSlug: organization.slug,
        campaignSlug: campaign.slug,
        campaignUuid: campaign.uuid,
        isActive: true,
      }),
    ];
  }, [organization, campaign]);

  // track page view
  useEffect(() => {
    if (!campaignCartItems) {
      return;
    }
    gtm.trackPackageRegistrationView({
      organizationSlug: organization.slug,
      organizationName: organization.name,
      items: campaignCartItems.map((item) => {
        return {
          productSlug: item.product.slug,
          productName: item.product.name,
          productPrice: item.product.price,
          quantity: item.quantity,
          organizationSlug: item.product.organization.slug,
          campaignSlug: item.campaign.slug,
          campaignUuid: item.campaign.uuid,
          campaignName: item.campaign.name,
        };
      }),
      totalPrice: cart.items.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
      }, 0),
    });
  }, [campaignCartItems]);

  const shouldRedirect = useMemo(() => {
    return isCartReady && !isDonationDetailsFilled;
  }, [isCartReady, isDonationDetailsFilled]);

  const shouldShowForm = useMemo(() => {
    return campaignCartItems?.length > 0 && !shouldRedirect;
  }, [campaignCartItems, shouldRedirect]);

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
          nextCampaignSlug: campaign.slug,
          nextCampaignUuid: campaign.uuid,
        },
      });
    }
  }, [shouldRedirect]);

  return (
    <>
      <Head>
        <title>
          {`Register package for ${campaign.name} | ${organization.name} | Shortage`}
        </title>
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
                        nextCampaignSlug: campaign.slug,
                        nextCampaignUuid: campaign.uuid,
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
                    pathname: '/[organizationSlug]/',
                    query: { organizationSlug: organization.slug },
                  }}
                >
                  the organization&apos;s page
                </Link>
                .
              </p>
            ) : null}

            {shouldShowForm ? (
              <>
                <Alert variant="info" className="mt-4">
                  The donation was made to the &quot;
                  <Link
                    className="break-word"
                    href={{
                      pathname:
                        '/[organizationSlug]/campaigns/[campaignSlug]/[campaignUuid]/',
                      query: {
                        organizationSlug: organization.slug,
                        campaignSlug: campaign.slug,
                        campaignUuid: campaign.uuid,
                      },
                    }}
                  >
                    {campaign.name}
                  </Link>
                  &quot; campaign.
                </Alert>

                <PackageRegistrationForm
                  organization={organization}
                  campaign={campaign}
                  items={campaignCartItems}
                />
              </>
            ) : null}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });
    const organizationSlug = context.params.organizationSlug as string;
    const campaignSlug = context.params.campaignSlug as string;
    const campaignUuid = context.params.campaignUuid as string;

    await Promise.all([
      store.dispatch(fetchOrganization({ organizationSlug, accessToken })),
      store.dispatch(
        fetchCampaign({
          organizationSlug,
          campaignSlug,
          campaignUuid,
          accessToken,
        })
      ),
    ]);

    const { organization, campaign } = store.getState();

    if (organization.error?.status === 404 || campaign.error?.status === 404) {
      return {
        notFound: true,
      };
    }

    return {
      props: {},
    };
  }
);

export default CampaignPackageRegistrationPage;
