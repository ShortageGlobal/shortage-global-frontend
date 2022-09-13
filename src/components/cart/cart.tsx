import styles from './cart.module.scss';
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Offcanvas, Button } from 'react-bootstrap';
import {
  useAppDispatch,
  useAppSelector,
  useCancelToken,
  useCart,
} from 'app/hooks';
import { selectCart, fetchCart, hideCartSidebar } from 'app/store/slices/cart';
import { groupCartItemsByOrganization } from 'app/helpers';
import { CART_ID_KEY } from 'app/constants';
import { CartItem } from 'components/cart/cart-item/cart-item';
import type { CartItem as CartItemType } from 'app/api/types';

export function Cart() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart, isCartSidebarShown } = useAppSelector(selectCart);

  const { updateCartItemQuantity, deleteFromCart } = useCart();

  const getFetchCartCancelToken = useCancelToken();

  // fetch cart if there is cartId in the local storage and the cart hasn't been fetched already
  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!!cart || !cartId) {
      return;
    }

    initialFetch();

    async function initialFetch() {
      const cancelToken = getFetchCartCancelToken();
      const response = await dispatch(fetchCart({ cartId, cancelToken }));

      // clear cartId from local storage if the cart doesn't
      if ((response.payload as any)?.status === 404) {
        localStorage.removeItem(CART_ID_KEY);
      }
    }
  }, []);

  const handleSidebarHide = useCallback(() => {
    dispatch(hideCartSidebar());
  }, []);

  // hide cart sidebar on route change
  useEffect(() => {
    handleSidebarHide();
  }, [router.route]);

  const groupedCartItems = useMemo(() => {
    return groupCartItemsByOrganization({ items: cart?.items });
  }, [cart?.items]);

  const handleItemQuantityChange = useCallback(
    ({ item, quantity }: { item: CartItemType; quantity: number }) => {
      updateCartItemQuantity({ item, quantity });
    },
    [updateCartItemQuantity]
  );

  const handleItemRemove = useCallback(
    ({ item }: { item: CartItemType }) => {
      deleteFromCart({ item });
    },
    [deleteFromCart]
  );

  return (
    <Offcanvas
      placement="end"
      className={styles.cart}
      show={isCartSidebarShown}
      onHide={handleSidebarHide}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className={styles.title}>My packages</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {groupedCartItems.size === 0 ? (
          <>
            <p>You haven't added any products to your packages yet.</p>
          </>
        ) : null}

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

                <Link
                  href={{
                    pathname: '/organizations/[organizationSlug]/packages',
                    query: { organizationSlug },
                  }}
                  passHref
                >
                  <Button className={styles.registerPackageButton}>
                    Register package
                  </Button>
                </Link>
              </div>
            );
          }
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
