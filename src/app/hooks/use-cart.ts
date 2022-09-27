import { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector, useCancelToken } from 'app/hooks';
import {
  selectCart,
  setIsCartSidebarShown,
  setCart as setCartAction,
  updateCartItemQuantity as updateCartItemQuantityAction,
  deleteCartItem as deleteCartItemAction,
} from 'app/store/slices/cart';
import {
  createCartItemAndRefetchCart as createCartItemAndRefetchCartAxios,
  deleteCartItem as deleteCartItemAxios,
  updateCartItemQuantity as updateCartItemQuantityAxios,
} from 'app/api';
import type {
  Product,
  Organization,
  CreateCartItem,
  CartItem,
} from 'app/api/types';

export function useCart() {
  const dispatch = useAppDispatch();
  const { cart, isCartLoading } = useAppSelector(selectCart);

  const getCreateCartItemCancelToken = useCancelToken();
  const getUpdateCartItemQuantityCancelToken = useCancelToken();
  const getDeleteCartItemCancelToken = useCancelToken();

  const isCartReady = useMemo(() => !!cart?.uuid, [cart]);

  const showCartSidebar = useCallback(() => {
    dispatch(setIsCartSidebarShown(true));
  }, []);

  const getCartItem = useCallback(
    ({
      productSlug,
      organizationSlug,
    }: {
      productSlug: Product['slug'];
      organizationSlug: Organization['slug'];
    }) => {
      return cart?.items.find((item) => {
        return (
          item.product.slug === productSlug &&
          item.product.organization.slug === organizationSlug
        );
      });
    },
    [cart]
  );

  const checkIsProductInCart = useCallback(
    ({
      productSlug,
      organizationSlug,
    }: {
      productSlug: Product['slug'];
      organizationSlug: Organization['slug'];
    }) => {
      return !!getCartItem({ productSlug, organizationSlug });
    },
    [getCartItem]
  );

  const addToCart = useCallback(
    async ({ product_slug, organization_slug, quantity }: CreateCartItem) => {
      if (!isCartReady) {
        // the action should have been disabled, so do nothing
        return;
      }

      const isProductInCart = checkIsProductInCart({
        productSlug: product_slug,
        organizationSlug: organization_slug,
      });
      if (isProductInCart) {
        // the action should have been disabled, so do nothing
        return;
      }

      // add a new cart item to the existing cart
      const cancelToken = getCreateCartItemCancelToken();
      const cartResponse = await createCartItemAndRefetchCartAxios({
        cartId: cart.uuid,
        product_slug,
        organization_slug,
        quantity,
        cancelToken,
      });
      dispatch(setCartAction(cartResponse.data));
    },
    [isCartReady, checkIsProductInCart, cart]
  );

  const updateCartItemQuantity = useCallback(
    async ({
      cartItemId,
      quantity,
    }: {
      cartItemId: CartItem['uuid'];
      quantity: number;
    }) => {
      if (!cart?.uuid) {
        return;
      }

      dispatch(updateCartItemQuantityAction({ cartItemId, quantity }));

      const cancelToken = getUpdateCartItemQuantityCancelToken(cartItemId);
      return updateCartItemQuantityAxios({
        cartId: cart.uuid,
        cartItemId,
        quantity,
        cancelToken,
      });
    },
    [cart]
  );

  const deleteFromCart = useCallback(
    async ({ cartItemId }: { cartItemId: CartItem['uuid'] }) => {
      if (!cart?.uuid) {
        return;
      }

      dispatch(deleteCartItemAction({ cartItemId }));

      const cancelToken = getDeleteCartItemCancelToken(cartItemId);
      return deleteCartItemAxios({
        cartId: cart.uuid,
        cartItemId,
        cancelToken,
      });
    },
    [cart]
  );

  return {
    cart,
    isCartReady,
    isCartLoading,
    showCartSidebar,
    getCartItem,
    checkIsProductInCart,
    addToCart,
    updateCartItemQuantity,
    deleteFromCart,
  };
}
