import styles from 'styles/pages/donation-cart.module.scss';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import Head from 'next/head';
import Link from 'next/link';
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
import { formatPrice, groupCartItemsByOrganization } from 'app/helpers';
import {
  Breadcrumbs,
  getHomeCrumb,
  getDonationDetailsCrumb,
  getDonationCartCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { CartItem } from 'components/cart/cart-item/cart-item';
import { ReviewDonationDetails } from 'components/review-donation-details/review-donation-details';
import { DonationOptions } from 'components/cart/donation-options/donation-options';
import { PAGE_KEY } from 'app/constants';
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

                <ReviewDonationDetails />

                <div>
                  <h4 className={styles.sectionHeader}>
                    How would you like to donate?
                  </h4>
                  <Row>
                    <Col>
                      <DonationOptions groupedCartItems={groupedCartItems} />
                    </Col>
                  </Row>
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
