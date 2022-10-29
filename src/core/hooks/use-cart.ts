import { useMemo, useCallback } from 'react';
import * as fbq from 'core/tracking/fpixel';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import {
  selectCart,
  setIsCartSidebarShown as setIsCartSidebarShownAction,
  setCart as setCartAction,
  updateCartItemQuantity as updateCartItemQuantityAction,
  deleteCartItem as deleteCartItemAction,
} from 'core/store/slices/cart';
import {
  fetchCart as fetchCartAxios,
  updateCart as updateCartAxios,
  createCartItemAndRefetchCart as createCartItemAndRefetchCartAxios,
  deleteCartItem as deleteCartItemAxios,
  updateCartItemQuantity as updateCartItemQuantityAxios,
} from 'core/api';
import type { UpdateCartData } from 'core/api';
import type {
  Product,
  Organization,
  CreateCartItem,
  CartItem,
} from 'core/api/types';

export function useCart() {
  const dispatch = useAppDispatch();
  const { cart, isCartLoading, isCartSidebarShown } =
    useAppSelector(selectCart);

  const isCartReady = useMemo(() => !!cart?.uuid, [cart]);

  const isDonationDetailsFilled = useMemo(() => {
    return !!cart?.email;
  }, [cart]);

  const setIsCartSidebarShown = useCallback((value: boolean) => {
    dispatch(setIsCartSidebarShownAction(value));
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

  const updateCart = useCallback(
    async ({
      firstName,
      lastName,
      email,
      phoneNumber,
      needTaxDeduction,
      addressLine1,
      addressLine2,
      city,
      stateProvinceRegion,
      zip,
      country,
    }: UpdateCartData) => {
      if (!isCartReady) {
        // the action should have been disabled, so do nothing
        return;
      }

      // PUT - update cart item
      await updateCartAxios({
        cartId: cart.uuid,
        firstName,
        lastName,
        email,
        phoneNumber,
        needTaxDeduction,
        addressLine1,
        addressLine2,
        city,
        stateProvinceRegion,
        zip,
        country,
      });

      // GET - fetch updated cart item
      const cartResponse = await fetchCartAxios({
        cartId: cart.uuid,
      });

      dispatch(setCartAction(cartResponse.data));
    },
    [isCartReady, cart]
  );

  const addToCart = useCallback(
    async ({
      organization_slug,
      product_slug,
      product_price,
      quantity,
    }: CreateCartItem & { product_price: Product['price'] }) => {
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
      const cartResponse = await createCartItemAndRefetchCartAxios({
        cartId: cart.uuid,
        product_slug,
        organization_slug,
        quantity,
      });
      dispatch(setCartAction(cartResponse.data));
      fbq.event('AddToCart', {
        content_type: 'product',
        content_name: organization_slug,
        contents: [{ id: product_slug, quantity }],
        value: product_price * quantity,
        currency: 'USD',
      });
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

      return updateCartItemQuantityAxios({
        cartId: cart.uuid,
        cartItemId,
        quantity,
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

      return deleteCartItemAxios({
        cartId: cart.uuid,
        cartItemId,
      });
    },
    [cart]
  );

  return {
    cart,
    isCartSidebarShown,
    isCartLoading,
    isCartReady,
    isDonationDetailsFilled,
    setIsCartSidebarShown,
    getCartItem,
    checkIsProductInCart,
    updateCart,
    addToCart,
    updateCartItemQuantity,
    deleteFromCart,
  };
}
