import { useMemo, useCallback } from 'react';
import * as gtm from 'core/tracking/gtm';
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
  Campaign,
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
      campaignSlug,
      campaignUuid,
    }: {
      productSlug: Product['slug'];
      organizationSlug: Organization['slug'];
      campaignSlug?: Campaign['slug'];
      campaignUuid?: Campaign['uuid'];
    }) => {
      return cart?.items.find((item) => {
        // If campaignSlug and campaignUuid are provided, match them.
        // Otherwise, we are looking for a general organization product
        const campaingMatch =
          campaignSlug && campaignUuid
            ? item.product?.campaign?.slug === campaignSlug &&
              item.product?.campaign?.uuid === campaignUuid
            : true;
        return (
          campaingMatch &&
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
      campaignSlug,
      campaignUuid,
    }: {
      productSlug: Product['slug'];
      organizationSlug: Organization['slug'];
      campaignSlug?: Campaign['slug'];
      campaignUuid?: Campaign['uuid'];
    }) => {
      return !!getCartItem({
        productSlug,
        organizationSlug,
        campaignSlug,
        campaignUuid,
      });
    },
    [getCartItem]
  );

  const updateCart = useCallback(
    async ({
      firstName,
      lastName,
      email,
      phoneNumber,
      agreedToTermsOfUse,
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
        agreedToTermsOfUse,
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
      organization_name,
      product_slug,
      product_name,
      product_price,
      campaign_slug,
      campaign_uuid,
      campaign_name,
      quantity,
    }: CreateCartItem & {
      organization_name: Organization['name'];
      campaign_name?: Campaign['name'];
      product_name: Product['name'];
      product_price: Product['price'];
    }) => {
      if (!isCartReady) {
        // the action should have been disabled, so do nothing
        return;
      }

      const isProductInCart = checkIsProductInCart({
        productSlug: product_slug,
        organizationSlug: organization_slug,
        campaignSlug: campaign_slug,
        campaignUuid: campaign_uuid,
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
        campaign_slug,
        campaign_uuid,
        quantity,
      });
      dispatch(setCartAction(cartResponse.data));
      gtm.trackAddToCart({
        organizationSlug: organization_slug,
        organizationName: organization_name,
        campaignSlug: campaign_slug,
        campaignUuid: campaign_uuid,
        campaignName: campaign_name,
        productSlug: product_slug,
        productName: product_name,
        productPrice: product_price,
        quantity,
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
