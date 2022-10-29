import axios from 'axios';
import { API_ROOT, PRODUCT_CATEGORY_ALL_KEY } from 'core/constants';
import type {
  OrganizationSlugParams,
  PaginationParams,
  ProductSlugParams,
  PaginatedResponse,
  Category,
  ProductPreview,
  Product,
  OnlineStore,
} from 'core/api/types';

export type FetchProductsParams = OrganizationSlugParams & {
  category?: Category;
  search?: string;
} & PaginationParams;
export function fetchProducts({
  organizationSlug,
  category = null,
  search = null,
  limit = null,
  offset = null,
  cancelToken = null,
}: FetchProductsParams) {
  return axios.get<PaginatedResponse<ProductPreview>>(
    encodeURI(`${API_ROOT}/api/organizations/${organizationSlug}/products/`),
    {
      params: {
        category: category !== PRODUCT_CATEGORY_ALL_KEY ? category : null,
        search: search.trim() !== '' ? search : null,
        limit,
        offset,
      },
      cancelToken: cancelToken?.token,
    }
  );
}

export type FetchProductParams = ProductSlugParams;
export function fetchProduct({
  organizationSlug,
  productSlug,
  cancelToken = null,
}: FetchProductParams) {
  return axios.get<Product>(
    encodeURI(
      `${API_ROOT}/api/organizations/${organizationSlug}/products/${productSlug}/`
    ),
    { cancelToken: cancelToken?.token }
  );
}

export type FetchOnlineStoresParams = ProductSlugParams;
export function fetchOnlineStores({
  organizationSlug,
  productSlug,
  cancelToken = null,
}: ProductSlugParams) {
  return axios.get<OnlineStore[]>(
    encodeURI(
      `${API_ROOT}/api/organizations/${organizationSlug}/products/${productSlug}/online-stores/`
    ),
    { cancelToken: cancelToken?.token }
  );
}
