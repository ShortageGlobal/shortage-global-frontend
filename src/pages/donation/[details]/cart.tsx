import styles from 'styles/pages/donation-cart.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { wrapper } from 'app/store';
import {
  useAppDispatch,
  useAppSelector,
  useCart,
  useCancelToken,
  isRequestCancel,
} from 'app/hooks';
import {
  fetchInstructions,
  selectInstructions,
} from 'app/store/slices/instructions';
import { createPackage } from 'app/api';
import { formatPrice, groupCartItemsByOrganization } from 'app/helpers';
import {
  Breadcrumbs,
  getHomeCrumb,
  getDonationDetailsCrumb,
  getDonationCartCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { CartItem } from 'components/cart/cart-item/cart-item';
import { InstructionsModal } from 'components/instructions-modal/instructions-modal';
import { WeAreHereForYou } from 'components/we-are-here-for-you/we-are-here-for-you';
import { PAGE_KEY, PACKAGE_TYPE } from 'app/constants';
import type { CartItem as CartItemType } from 'app/api/types';
import type { NextPageWithLayout } from 'pages/_app';

const DonationCart: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    cart,
    isCartReady,
    isDonationDetailsFilled,
    updateCartItemQuantity,
    deleteFromCart,
  } = useCart();
  const { instructions, isInstructionsLoading } =
    useAppSelector(selectInstructions);

  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [isPackageBeingCreated, setIsPackageBeingCreated] = useState(false);

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

  const totalPrice = useMemo(() => {
    return cart?.items.reduce(
      (sum, item) => sum + (item.product.price || 0) * item.quantity,
      0
    );
  }, [cart?.items]);

  const groupedCartItems = useMemo(() => {
    return groupCartItemsByOrganization({ items: cart?.items });
  }, [cart?.items]);

  const shouldRedirect = useMemo(() => {
    return isCartReady && !isDonationDetailsFilled;
  }, [isCartReady, isDonationDetailsFilled]);

  const shouldShowContent = useMemo(() => {
    return (
      !shouldRedirect && instructions !== null && groupedCartItems.size > 0
    );
  }, [shouldRedirect, instructions, groupedCartItems]);

  const shouldShowNoItemsMessage = useMemo(() => {
    return (
      !shouldRedirect &&
      !shouldShowContent &&
      isCartReady &&
      groupedCartItems.size === 0
    );
  }, [shouldRedirect, shouldShowContent, isCartReady, groupedCartItems]);

  const shouldShowLoadingMessage = useMemo(() => {
    return !shouldRedirect && !shouldShowContent && !shouldShowNoItemsMessage;
  }, [shouldRedirect, shouldShowContent, shouldShowNoItemsMessage]);

  // TODO: HARDCODE! Add support for multiple organizations in cart
  const firstOrganization = useMemo(() => {
    return Array.from(groupedCartItems.values())[0];
  }, [groupedCartItems]);
  const organizationInstructions = useMemo(() => {
    return instructions?.[firstOrganization?.organizationSlug];
  }, [instructions, firstOrganization]);

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

  const handleItemQuantityChange = useCallback(
    async ({ item, quantity }: { item: CartItemType; quantity: number }) => {
      try {
        await updateCartItemQuantity({ cartItemId: item.uuid, quantity });
      } catch (rejection) {
        if (!isRequestCancel(rejection)) {
          throw rejection;
        }
      }
    },
    [updateCartItemQuantity]
  );

  const handleItemRemove = useCallback(
    ({ item }: { item: CartItemType }) => {
      deleteFromCart({ cartItemId: item.uuid });
    },
    [deleteFromCart]
  );

  const getCreatePackageCancelToken = useCancelToken();
  const handleFundDonation = useCallback(async () => {
    const cancelToken = getCreatePackageCancelToken();
    setIsPackageBeingCreated(true);
    try {
      const response = await createPackage({
        type: PACKAGE_TYPE.FUNDED_BY_DONOR,
        organizationSlug: firstOrganization.organizationSlug,
        firstName: cart.first_name,
        lastName: cart.last_name,
        email: cart.email,
        phoneNumber: cart.phone_number,
        needTaxDeduction: cart.need_tax_deduction,
        addressLine1: cart.address_line1,
        addressLine2: cart.address_line2,
        city: cart.city,
        stateProvinceRegion: cart.state_province_region,
        zip: cart.zip,
        country: cart.country,
        items: groupedCartItems
          .get(firstOrganization.organizationSlug)
          .items.map((item) => {
            return { product: item.product.slug, quantity: item.quantity };
          }),
        cancelToken,
      });
      window.open(response.data.checkout_url, '_self');
    } catch (rejection) {
      if (isRequestCancel(rejection)) {
        return;
      }
      setIsPackageBeingCreated(false);
    }
  }, [firstOrganization, cart, groupedCartItems]);

  const handleShowInstructionsModal = useCallback(() => {
    setShowInstructionsModal(true);
  }, []);

  const handleHideInstructionsModal = useCallback(() => {
    setShowInstructionsModal(false);
  }, []);

  const handleTangibleDonation = useCallback(() => {
    handleShowInstructionsModal();
  }, []);

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
            <h2>Donation Cart</h2>

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
              <div className={styles.loadingMessage}>
                <Spinner animation="border" role="status"></Spinner>
                <span>
                  Redirecting to{' '}
                  <Link
                    href={{
                      pathname: '/donation/details',
                      query: {
                        showDonationDetailsAlert: true,
                        next: PAGE_KEY.DONATION_CART,
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
                <span>Loading data...</span>
              </div>
            ) : null}

            {shouldShowNoItemsMessage ? (
              <p className={styles.noItemsMessage}>
                Your donation cart doesn&apos;t have any goods. Check the
                requested goods on{' '}
                <Link href={{ pathname: '/' }}>
                  <a>the homepage</a>
                </Link>
                .
              </p>
            ) : null}

            {shouldShowContent ? (
              <>
                <div>
                  {Array.from(groupedCartItems.values()).map(
                    (cartItemsGroup) => {
                      return (
                        <div
                          key={cartItemsGroup.organizationSlug}
                          className={styles.cartItemsGroup}
                        >
                          <p>
                            For{' '}
                            <Link
                              href={{
                                pathname: '/organizations/[organizationSlug]',
                                query: {
                                  organizationSlug:
                                    cartItemsGroup.organizationSlug,
                                },
                              }}
                            >
                              <a>{cartItemsGroup.organizationName}</a>
                            </Link>
                          </p>
                          <div className={styles.cartItemsList}>
                            {cartItemsGroup.items.map((item) => {
                              return (
                                <CartItem
                                  key={item.uuid}
                                  item={item}
                                  onQuantityChange={handleItemQuantityChange}
                                  onRemove={handleItemRemove}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                <dl className={styles.summaryLine}>
                  <dt className={styles.summaryLabel}>Total donation</dt>
                  <dd className={styles.summaryValue}>
                    {formatPrice(totalPrice)}
                  </dd>
                </dl>

                <div>
                  <h4 className={styles.sectionHeader}>
                    How would you like to donate?
                  </h4>
                  <Row>
                    {/* Fund donation option */}
                    <Col sm={6} className={styles.donationOptionButtonCol}>
                      <button
                        onClick={handleFundDonation}
                        className={styles.donationOptionButton}
                        disabled={isPackageBeingCreated}
                      >
                        <div className={styles.donationOptionGlyph}>
                          <Image
                            alt=""
                            src="/images/donation-cart/donation-fund.svg"
                            width={50}
                            height={50}
                          />
                        </div>
                        <p>We&apos;ll buy the selected goods on your behalf</p>
                        <Button
                          as="span"
                          size="lg"
                          tabIndex={-1}
                          className={styles.button}
                        >
                          {isPackageBeingCreated ? (
                            <Loader
                              role="status"
                              aria-hidden="true"
                              className={animationStyles.rotate}
                            />
                          ) : null}
                          <span>Fund Donation</span>
                        </Button>
                      </button>
                    </Col>

                    {/* Send what donor has option */}
                    <Col sm={6} className={styles.donationOptionButtonCol}>
                      <button
                        onClick={handleTangibleDonation}
                        className={styles.donationOptionButton}
                      >
                        <div className={styles.donationOptionGlyph}>
                          <Image
                            alt=""
                            src="/images/donation-cart/donation-package.svg"
                            width={50}
                            height={50}
                          />
                        </div>
                        <p>We&apos;ll provide delivery instructions</p>
                        <Button
                          as="span"
                          size="lg"
                          tabIndex={-1}
                          className={styles.button}
                        >
                          Donate what I have
                        </Button>
                      </button>
                    </Col>
                  </Row>
                </div>
              </>
            ) : null}
          </Col>
        </Row>
      </Container>

      <WeAreHereForYou />

      {organizationInstructions?.length > 0 ? (
        <InstructionsModal
          show={showInstructionsModal}
          organizationSlug={firstOrganization?.organizationSlug}
          organizationName={firstOrganization?.organizationName}
          instructions={organizationInstructions}
          onHide={handleHideInstructionsModal}
        />
      ) : null}
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default DonationCart;
