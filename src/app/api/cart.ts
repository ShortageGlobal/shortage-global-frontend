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
  items?: CreateCartItem[];
};
export async function createCart({
  items = [],
  cancelToken = null,
}: CreateCartParams) {
  return axios.post<{ uuid: Uuid }>(
    encodeURI(`${API_ROOT}/api/carts/`),
    { items },
    { cancelToken: cancelToken?.token }
  );
}

export type FetchCartParams = CartUuidParams;
export async function fetchCart({
  cartId,
  cancelToken = null,
}: FetchCartParams) {
  return axios.get<Cart>(encodeURI(`${API_ROOT}/api/carts/${cartId}/`), {
    cancelToken: cancelToken?.token,
  });
}

export type UpdateCartParams = CartUuidParams & {
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  needTaxDeduction: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvinceRegion?: string;
  zip?: string;
  country: string;
};
export async function updateCart({
  cartId,
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
  cancelToken = null,
}: UpdateCartParams) {
  return axios.put(encodeURI(`${API_ROOT}/api/carts/${cartId}/`), {
    first_name: firstName,
    last_name: lastName,
    email,
    phone_number: phoneNumber,
    need_tax_deduction: needTaxDeduction,
    address_line1: addressLine1,
    address_line2: addressLine2,
    city,
    state_province_region: stateProvinceRegion,
    zip,
    country,
    cancelToken: cancelToken?.token,
  });
}

export type CreateCartItemParams = CartUuidParams & CreateCartItem;
export async function createCartItem({
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
export async function deleteCartItem({
  cartId,
  cartItemId,
  cancelToken = null,
}: DeleteCartItemParams) {
  return axios.delete<undefined>(
    encodeURI(`${API_ROOT}/api/carts/${cartId}/items/${cartItemId}/`),
    { cancelToken: cancelToken?.token }
  );
}

export type UpdateCartItemQuantityParams = CartUuidParams & {
  cartItemId: Uuid;
  quantity: number;
};
export async function updateCartItemQuantity({
  cartId,
  cartItemId,
  quantity,
  cancelToken = null,
}: UpdateCartItemQuantityParams) {
  return axios.put<{ uuid: Uuid }>(
    encodeURI(`${API_ROOT}/api/carts/${cartId}/items/${cartItemId}/`),
    { quantity },
    { cancelToken: cancelToken?.token }
  );
}

export type CreateAndFetchCartParams = CreateCartParams;
export async function createAndFetchCart({
  items = [],
  cancelToken = null,
}: CreateAndFetchCartParams) {
  // POST - create cart
  const responseCreate = await createCart({ items, cancelToken });
  const cartId = responseCreate.data.uuid;

  // GET - fetch newly created cart
  return fetchCart({ cartId, cancelToken });
}

export type CreateCartItemAndRefetchCartParams = CreateCartItemParams;
export async function createCartItemAndRefetchCart({
  cartId,
  product_slug,
  organization_slug,
  quantity,
  cancelToken = null,
}: CreateCartItemAndRefetchCartParams) {
  // POST - create cart item
  await createCartItem({
    cartId,
    product_slug,
    organization_slug,
    quantity,
    cancelToken,
  });

  // GET - fetch updated cart
  return fetchCart({ cartId, cancelToken });
}
