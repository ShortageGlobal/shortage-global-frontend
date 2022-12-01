import styles from './cart-sidebar.module.scss';
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Offcanvas, Button } from 'react-bootstrap';
import {
  useAppDispatch,
  useCancelToken,
  useCart,
  isRequestCancel,
} from 'core/hooks';
import { setIsCartLoading, setCart } from 'core/store/slices/cart';
import { fetchCart, createAndFetchCart } from 'core/api';
import { groupCartItemsByOrganization } from 'core/helpers';
import { CartItem } from 'components/cart/cart-item/cart-item';
import { ProceedToDonationButton } from 'components/proceed-to-donation-button/proceed-to-donation-button';
import { REQUESTED_GOODS_CONTAINER_ID, CART_ID_KEY } from 'core/constants';
import type { CartItem as CartItemType } from 'core/api/types';

export function CartSidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    cart,
    isCartSidebarShown,
    setIsCartSidebarShown,
    updateCartItemQuantity,
    deleteFromCart,
  } = useCart();

  const getFetchOrCreateCartCancelToken = useCancelToken();

  // fetch cart if there is cartId in the local storage and the cart hasn't been fetched already
  useEffect(() => {
    const cancelToken = getFetchOrCreateCartCancelToken();

    dispatch(setIsCartLoading(true));
    fetchOrCreateCart();

    async function fetchOrCreateCart() {
      const cartId = localStorage.getItem(CART_ID_KEY);
      let cartResponse;

      // try to fetch the cart with ID from local storage
      if (cartId) {
        try {
          cartResponse = await fetchCart({ cartId, cancelToken });
        } catch (rejection) {
          if (isRequestCancel(rejection)) {
            return;
          }
          if (rejection.response.status !== 404) {
            dispatch(setIsCartLoading(false));
            // TODO: handle error gracefully
            throw rejection;
          }
        }
      }

      // if there is no cart, create one
      if (!cartResponse) {
        try {
          cartResponse = await createAndFetchCart({ cancelToken });
        } catch (rejection) {
          if (isRequestCancel(rejection)) {
            return;
          }
          dispatch(setIsCartLoading(false));
          // TODO: handle error gracefully
          throw rejection;
        }
      }

      dispatch(setCart(cartResponse.data));

      // store cartId in localStorage so the cart could be restored on refresh
      localStorage.setItem(CART_ID_KEY, cartResponse.data.uuid);
    }
  }, []);

  const handleSidebarHide = useCallback(() => {
    setIsCartSidebarShown(false);
  }, []);

  // hide cart sidebar on route change
  useEffect(() => {
    router.events.on('routeChangeStart', handleSidebarHide);
    return () => {
      router.events.off('routeChangeStart', handleSidebarHide);
    };
  }, [router, isCartSidebarShown]);

  const groupedCartItems = useMemo(() => {
    return groupCartItemsByOrganization({ items: cart?.items });
  }, [cart?.items]);

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
    <Offcanvas
      placement="end"
      className={styles.cartSidebar}
      show={isCartSidebarShown}
      onHide={handleSidebarHide}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className={styles.title}>
          Donation cart
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className={styles.body}>
        {/* Empty cart message */}
        {groupedCartItems.size === 0 ? (
          <>
            <p>You don&apos;t have any products in your cart.</p>
            <Link
              href={`/#${REQUESTED_GOODS_CONTAINER_ID}`}
              passHref
              legacyBehavior
            >
              <Button
                size="lg"
                className={styles.checkGoodsButton}
                onClick={handleSidebarHide}
              >
                <span>Check out our top requests</span>
              </Button>
            </Link>
          </>
        ) : null}

        {/* Items grouped by organizations */}
        {Array.from(groupedCartItems.values()).map(
          ({ organizationName, organizationSlug, items }) => {
            return (
              <div key={organizationSlug} className={styles.cartGroup}>
                <p className="text-truncate">
                  For{' '}
                  <Link
                    href={{
                      pathname: '/organizations/[organizationSlug]',
                      query: { organizationSlug },
                    }}
                  >
                    {organizationName}
                  </Link>
                </p>

                <div className={styles.cartGroupItems}>
                  {items.map((item) => (
                    <CartItem
                      key={item.uuid}
                      item={item}
                      onQuantityChange={handleItemQuantityChange}
                      onRemove={handleItemRemove}
                    />
                  ))}
                </div>
              </div>
            );
          }
        )}

        {/* Proceed Button */}
        {groupedCartItems.size > 0 ? (
          <div className={styles.footer}>
            <ProceedToDonationButton className={styles.proceedButton} />
          </div>
        ) : null}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
