import styles from 'styles/pages/donation-cart.module.scss';
import { Fragment, useMemo, useCallback, useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Alert,
  Placeholder,
  Badge,
} from 'react-bootstrap';
import { Info } from 'react-feather';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { wrapper } from 'core/store';
import {
  useAppDispatch,
  useAppSelector,
  useUser,
  useCart,
  useCancelToken,
} from 'core/hooks';
import {
  fetchInstructions,
  selectInstructions,
} from 'core/store/slices/instructions';
import { groupCartItemsByOrganization } from 'core/helpers';
import {
  Breadcrumbs,
  getHomeCrumb,
  getDonationDetailsCrumb,
  getDonationCartCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { CartGroup } from 'components/cart/cart-group/cart-group';
import { CartItemPlaceholder } from 'components/cart/cart-item/cart-item-placeholder/cart-item-placeholder';
import { ReviewDonationDetails } from 'components/review-donation-details/review-donation-details';
import { LoadingMessage } from 'components/loading-message/loading-message';
import { RegistrationEncouragement } from 'components/registration-encouragement/registration-encouragement';
import { PAGE_KEY, REQUESTED_GOODS_CONTAINER_ID } from 'core/constants';
import type { NextPageWithLayout } from 'pages/_app';

const DonationCart: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isSessionLoading, isUnauthenticated } = useUser();

  const { cart, isCartReady, isDonationDetailsFilled } = useCart();
  const { instructions, isInstructionsLoading } =
    useAppSelector(selectInstructions);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getDonationDetailsCrumb(),
      getDonationCartCrumb({ isActive: true }),
    ];
  }, []);

  const [showPaymentStatusCanceledAlert, setShowPaymentStatusCanceledAlert] =
    useState(() => router.query?.paymentStatus === 'cancelled');

  const handleDismissPaymentStatusCanceledAlert = useCallback(() => {
    setShowPaymentStatusCanceledAlert(false);

    // remove "paymentStatus" from query params
    const queryParams = { ...router.query };
    delete queryParams.paymentStatus;

    router.replace(
      { query: queryParams },
      undefined,
      { shallow: true } // do not run getServerSideProps
    );
  }, [router]);

  const groupedCartItems = useMemo(() => {
    return groupCartItemsByOrganization({ items: cart?.items });
  }, [cart?.items]);

  const shouldRedirect = useMemo(() => {
    return isCartReady && !isDonationDetailsFilled;
  }, [isCartReady, isDonationDetailsFilled]);

  const shouldShowContent = useMemo(() => {
    return (
      !isSessionLoading &&
      !shouldRedirect &&
      instructions !== null &&
      groupedCartItems.size > 0
    );
  }, [isSessionLoading, shouldRedirect, instructions, groupedCartItems]);

  const shouldShowNoItemsMessage = useMemo(() => {
    return (
      !shouldRedirect &&
      !shouldShowContent &&
      isCartReady &&
      groupedCartItems.size === 0
    );
  }, [shouldRedirect, shouldShowContent, isCartReady, groupedCartItems]);

  const shouldShowPlaceholder = useMemo(() => {
    return !shouldRedirect && !shouldShowContent && !shouldShowNoItemsMessage;
  }, [shouldRedirect, shouldShowContent, shouldShowNoItemsMessage]);

  // count the total number of groups (organizations + campaigns)
  const totalGroupsCount = useMemo(() => {
    let total = 0;
    for (const cartGroup of groupedCartItems.values()) {
      total += cartGroup.items.length > 0 ? 1 : 0;
      total += cartGroup.campaigns.size;
    }
    return total;
  }, [groupedCartItems]);

  // redirect to Donation Details if they aren't filled yet
  useEffect(() => {
    if (shouldRedirect) {
      router.push({
        pathname: '/donation/details',
        query: {
          showDonationDetailsAlert: true,
          next: PAGE_KEY.DONATION_CART,
        },
      });
    }
  }, [shouldRedirect]);

  // fetch instructions
  const getFetchInstructionsCancelToken = useCancelToken();
  useEffect(() => {
    if (
      !isCartReady ||
      !isDonationDetailsFilled ||
      isInstructionsLoading ||
      instructions !== null
    ) {
      return;
    }
    const organizationSlugs = Array.from(groupedCartItems.keys());
    const cancelToken = getFetchInstructionsCancelToken();
    dispatch(fetchInstructions({ organizationSlugs, cancelToken }));
  }, [isCartReady, isDonationDetailsFilled, groupedCartItems, instructions]);

  return (
    <>
      <Head>
        <title>Donation Cart | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      {/* TODO: placeholder for "isCartReady" */}

      <Container className={styles.mainContent}>
        <Row>
          <Col className={styles.donationCartCol}>
            <h2 className={styles.header}>Donation Cart</h2>

            {showPaymentStatusCanceledAlert ? (
              <Alert
                variant="warning"
                className={styles.requireDetailsAlert}
                onClose={handleDismissPaymentStatusCanceledAlert}
                dismissible
              >
                <Alert.Heading>Payment cancelled</Alert.Heading>
                <div>We weren&apos;t able to proccess your donation.</div>
              </Alert>
            ) : null}

            {shouldRedirect ? (
              <LoadingMessage className={styles.redirectingMessage}>
                <span>
                  Redirecting to{' '}
                  <Link
                    href={{
                      pathname: '/donation/details/',
                      query: {
                        showDonationDetailsAlert: true,
                        next: PAGE_KEY.DONATION_CART,
                      },
                    }}
                  >
                    Donation Details
                  </Link>
                </span>
              </LoadingMessage>
            ) : null}

            {shouldShowPlaceholder ? (
              <Placeholder
                as="div"
                animation="glow"
                className={styles.placeholderContainer}
              >
                <Placeholder
                  as="div"
                  size="lg"
                  className={styles.organizationName}
                />
                <CartItemPlaceholder />
                <CartItemPlaceholder />
              </Placeholder>
            ) : null}

            {shouldShowNoItemsMessage ? (
              <p className={styles.noItemsMessage}>
                Your donation cart doesn&apos;t have any goods. Check the
                requested goods on{' '}
                <Link href={`/#${REQUESTED_GOODS_CONTAINER_ID}`}>
                  the homepage
                </Link>
                .
              </p>
            ) : null}

            {shouldShowContent ? (
              <>
                {isUnauthenticated ? <RegistrationEncouragement /> : null}

                <Alert variant="info">
                  <Alert.Heading className={styles.donationOptionsAlertHeading}>
                    <Info size={20} />
                    <span>Donation Options</span>
                  </Alert.Heading>
                  <div>
                    <span>You can donate in two ways:</span>
                    <ol className={styles.donationOptionsAlertList}>
                      <li>
                        <b>Order items</b> - we will buy the selected goods on
                        your behalf and send them directly to the
                        nonprofit&apos;s warehouse.
                      </li>
                      <li>
                        <b>Donate what you have</b> - we will provide delivery
                        instructions so you could send the gift to the
                        nonprofit&apos;s warehouse yourself.
                      </li>
                    </ol>
                  </div>
                </Alert>

                <ReviewDonationDetails />

                {/* Cart Groups */}
                <div>
                  {Array.from(groupedCartItems.values()).map((cartGroup) => {
                    let counter = 1;
                    const showOrgDraftBadge =
                      cartGroup.isOrganizationDraft ||
                      !cartGroup.isOrganizationVerified;

                    return (
                      <Fragment key={cartGroup.organizationSlug}>
                        {/* Organization group */}
                        {cartGroup.items.length > 0 ? (
                          <CartGroup
                            title={
                              <>
                                {totalGroupsCount > 1 ? `${counter++}. ` : null}
                                {showOrgDraftBadge ? (
                                  <Badge bg="secondary" className="me-2">
                                    Draft
                                  </Badge>
                                ) : null}
                                For{' '}
                                <Link
                                  href={{
                                    pathname: '/[organizationSlug]/',
                                    query: {
                                      organizationSlug:
                                        cartGroup.organizationSlug,
                                    },
                                  }}
                                >
                                  {cartGroup.organizationName}
                                </Link>
                              </>
                            }
                            organizationSlug={cartGroup.organizationSlug}
                            organizationName={cartGroup.organizationName}
                            items={cartGroup.items}
                          />
                        ) : null}

                        {/* Campaign group */}
                        {Array.from(cartGroup.campaigns.values()).map(
                          (cartCampaign) => {
                            const showCampaignDraftBadge =
                              showOrgDraftBadge || cartCampaign.isCampaignDraft;
                            return (
                              <CartGroup
                                key={cartCampaign.campaignUuid}
                                title={
                                  <>
                                    {totalGroupsCount > 1
                                      ? `${counter++}. `
                                      : null}
                                    {showCampaignDraftBadge ? (
                                      <Badge bg="secondary" className="me-2">
                                        Draft
                                      </Badge>
                                    ) : null}
                                    For the &quot;
                                    <Link
                                      href={{
                                        pathname:
                                          '/[organizationSlug]/campaigns/[campaignSlug]/[campaignUuid]',
                                        query: {
                                          organizationSlug:
                                            cartGroup.organizationSlug,
                                          campaignSlug:
                                            cartCampaign.campaignSlug,
                                          campaignUuid:
                                            cartCampaign.campaignUuid,
                                        },
                                      }}
                                    >
                                      {cartCampaign.campaignName}
                                    </Link>
                                    &quot; campaign of{' '}
                                    <Link
                                      href={{
                                        pathname: '/[organizationSlug]/',
                                        query: {
                                          organizationSlug:
                                            cartGroup.organizationSlug,
                                        },
                                      }}
                                    >
                                      {cartGroup.organizationName}
                                    </Link>
                                  </>
                                }
                                organizationSlug={cartGroup.organizationSlug}
                                organizationName={cartGroup.organizationName}
                                campaignSlug={cartCampaign.campaignSlug}
                                campaignUuid={cartCampaign.campaignUuid}
                                campaignName={cartCampaign.campaignName}
                                items={cartCampaign.campaignItems}
                              />
                            );
                          }
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </>
            ) : null}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default DonationCart;
