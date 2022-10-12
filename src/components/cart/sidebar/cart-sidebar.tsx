import styles from './cart-sidebar.module.scss';
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Offcanvas } from 'react-bootstrap';
import {
  useAppDispatch,
  useAppSelector,
  useCancelToken,
  useCart,
  isRequestCancel,
} from 'app/hooks';
import { selectCart, setIsCartLoading, setCart } from 'app/store/slices/cart';
import { fetchCart, createAndFetchCart } from 'app/api';
import { groupCartItemsByOrganization } from 'app/helpers';
import { CART_ID_KEY } from 'app/constants';
import { CartItem } from 'components/cart/cart-item/cart-item';
import { ProceedToDonationButton } from 'components/proceed-to-donation-button/proceed-to-donation-button';
import type { CartItem as CartItemType } from 'app/api/types';

export function CartSidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isCartSidebarShown } = useAppSelector(selectCart);

  const {
    cart,
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
    handleSidebarHide();
  }, [router.asPath]);

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
                    <a>{organizationName}</a>
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
