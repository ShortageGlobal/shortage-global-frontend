import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector, useCancelToken } from 'app/hooks';
import { selectCart, createCart, createCartItem } from 'app/store/slices/cart';
import type { Slug, CreateCartItem } from 'app/api/types';

export function useCart() {
  const dispatch = useAppDispatch();
  const { cart, isCartLoading } = useAppSelector(selectCart);

  const getCreateCartCancelToken = useCancelToken();
  const getCreateCartItemCancelToken = useCancelToken();

  const initCart = useCallback(async (items: CreateCartItem[]) => {
    const cancelToken = getCreateCartCancelToken();
    return dispatch(createCart({ items, cancelToken }));
  }, []);

  const checkIsProductInCart = useCallback(
    ({
      productSlug,
      organizationSlug,
    }: {
      productSlug: Slug;
      organizationSlug: Slug;
    }) => {
      return cart?.items.some((item) => {
        return (
          item.product.slug === productSlug &&
          item.product.organization.slug === organizationSlug
        );
      });
    },
    [cart]
  );

  const addToCart = useCallback(
    ({ product_slug, organization_slug, quantity }: CreateCartItem) => {
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
      return dispatch(
        createCartItem({
          cartId: cart.uuid,
          product_slug,
          organization_slug,
          quantity,
          cancelToken,
        })
      );
    },
    [cart, isCartLoading, initCart]
  );

  return {
    checkIsProductInCart,
    addToCart,
  };
}
