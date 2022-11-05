import styles from 'styles/pages/donation-cart.module.scss';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Placeholder } from 'react-bootstrap';
import { Info } from 'react-feather';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { wrapper } from 'core/store';
import {
  useAppDispatch,
  useAppSelector,
  useCart,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import {
  fetchInstructions,
  selectInstructions,
} from 'core/store/slices/instructions';
import { formatPrice, groupCartItemsByOrganization } from 'core/helpers';
import {
  Breadcrumbs,
  getHomeCrumb,
  getDonationDetailsCrumb,
  getDonationCartCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { CartItem } from 'components/cart/cart-item/cart-item';
import { CartItemPlaceholder } from 'components/cart/cart-item/cart-item-placeholder/cart-item-placeholder';
import { ReviewDonationDetails } from 'components/review-donation-details/review-donation-details';
import { DonationOptions } from 'components/cart/donation-options/donation-options';
import { LoadingMessage } from 'components/loading-message/loading-message';
import { PAGE_KEY, REQUESTED_GOODS_CONTAINER_ID } from 'core/constants';
import type { CartItem as CartItemType } from 'core/api/types';
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

  const shouldShowPlaceholder = useMemo(() => {
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
                        your behalf.
                      </li>
                      <li>
                        <b>Donate what you have</b> - we will provide delivery
                        instructions.
                      </li>
                    </ol>
                  </div>
                </Alert>

                <ReviewDonationDetails />

                {/* Cart Groups */}
                <div>
                  {Array.from(groupedCartItems.values()).map(
                    (cartGroup, index) => {
                      const totalPrice = cartGroup.items.reduce(
                        (sum, item) =>
                          sum + (item.product.price || 0) * item.quantity,
                        0
                      );

                      return (
                        <div
                          key={cartGroup.organizationSlug}
                          className={styles.cartGroup}
                        >
                          {/* Title */}
                          <p className={styles.cartGroupTitle}>
                            {groupedCartItems.size > 1
                              ? `${index + 1}. `
                              : null}
                            For{' '}
                            <Link
                              href={{
                                pathname: '/organizations/[organizationSlug]',
                                query: {
                                  organizationSlug: cartGroup.organizationSlug,
                                },
                              }}
                            >
                              {cartGroup.organizationName}
                            </Link>
                          </p>

                          {/* Cart Items */}
                          <div className={styles.cartItemsList}>
                            {cartGroup.items.map((item) => {
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

                          {/* Summary */}
                          <dl className={styles.summaryLine}>
                            <dt className={styles.summaryLabel}>
                              Total donation
                            </dt>
                            <dd className={styles.summaryValue}>
                              {formatPrice(totalPrice)}
                            </dd>
                          </dl>

                          {/* Donation Options */}
                          <DonationOptions cartGroup={cartGroup} />
                        </div>
                      );
                    }
                  )}
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
