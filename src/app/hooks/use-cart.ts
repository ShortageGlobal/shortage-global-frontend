import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, useCancelToken } from 'app/hooks';
import {
  selectCart,
  showCartSidebar as showCartSidebarAction,
  setCart as setCartAction,
  updateCartItemQuantity as updateCartItemQuantityAction,
  deleteCartItem as deleteCartItemAction,
} from 'app/store/slices/cart';
import {
  createAndFetchCart as createAndFetchCartAxios,
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
  const { cart, isCartReady, isCartLoading } = useAppSelector(selectCart);

  const getCreateCartCancelToken = useCancelToken();
  const getCreateCartItemCancelToken = useCancelToken();
  const getUpdateCartItemQuantityCancelToken = useCancelToken();
  const getDeleteCartItemCancelToken = useCancelToken();

  const showCartSidebar = useCallback(() => {
    dispatch(showCartSidebarAction());
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

  const initCart = useCallback(async (items: CreateCartItem[]) => {
    const cancelToken = getCreateCartCancelToken();
    const cartResponse = await createAndFetchCartAxios({
      items,
      cancelToken,
    });
    dispatch(setCartAction(cartResponse.data));
  }, []);

  const addToCart = useCallback(
    async ({ product_slug, organization_slug, quantity }: CreateCartItem) => {
      if (isCartLoading) {
        // the action should have been disabled, so do nothing
        return;
      }

      // if there is no cart, create one
      if (!cart) {
        return initCart([{ product_slug, organization_slug, quantity }]);
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
    [cart, isCartLoading, initCart]
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
