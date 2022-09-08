import axios from 'axios';
import { API_ROOT } from 'app/constants';
import type {
  Uuid,
  CartUuidParams,
  CancelTokenParams,
  CreateCartItem,
  Cart,
} from 'app/api/types';

export type CreateCartParams = CancelTokenParams & {
  items: CreateCartItem[];
};
export function createCart({ items, cancelToken = null }: CreateCartParams) {
  return axios.post<{ uuid: Uuid }>(
    encodeURI(`${API_ROOT}/api/carts/`),
    { items },
    { cancelToken: cancelToken?.token }
  );
}

export type FetchCartParams = CartUuidParams;
export function fetchCart({ cartId, cancelToken = null }: FetchCartParams) {
  return axios.get<Cart>(encodeURI(`${API_ROOT}/api/carts/${cartId}/`), {
    cancelToken: cancelToken?.token,
  });
}

export type CreateCartItemParams = CartUuidParams & CreateCartItem;
export function createCartItem({
  cartId,
  product_slug,
  organization_slug,
  quantity,
  cancelToken = null,
}: CreateCartItemParams) {
  return axios.post<{ uuid: Uuid }>(
    encodeURI(`${API_ROOT}/api/carts/${cartId}/items/`),
    {
      product_slug,
      organization_slug,
      quantity,
    },
    { cancelToken: cancelToken?.token }
  );
}

export type DeleteCartItemParams = CartUuidParams & { cartItemId: Uuid };
export function deleteCartItem({
  cartId,
  cartItemId,
  cancelToken = null,
}: DeleteCartItemParams) {
  return axios.delete<undefined>(
    encodeURI(`${API_ROOT}/api/carts/${cartId}/items/${cartItemId}/`),
    { cancelToken: cancelToken?.token }
  );
}

export type UpdateCartItemParams = CartUuidParams & {
  cartItemId: Uuid;
  quantity: number;
};
export function updateCartItemQuantity({
  cartId,
  cartItemId,
  quantity,
  cancelToken = null,
}: UpdateCartItemParams) {
  return axios.put<{ uuid: Uuid }>(
    encodeURI(`${API_ROOT}/api/carts/${cartId}/items/${cartItemId}/`),
    { quantity },
    { cancelToken: cancelToken?.token }
  );
}
