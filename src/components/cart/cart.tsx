import styles from './cart.module.scss';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Offcanvas } from 'react-bootstrap';
import {
  useAppDispatch,
  useAppSelector,
  useCancelToken,
  useCart,
} from 'app/hooks';
import { selectCart, fetchCart, hideCartSidebar } from 'app/store/slices/cart';
import { CART_ID_KEY } from 'app/constants';

export function Cart() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart, isCartSidebarShown } = useAppSelector(selectCart);

  useCart();

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
      <Offcanvas.Body>TBD</Offcanvas.Body>
    </Offcanvas>
  );
}
