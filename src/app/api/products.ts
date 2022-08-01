import axios from 'axios';
import { API_ROOT } from 'app/constants';
import type {
  OrganizationSlugParams,
  PaginationParams,
  ProductSlugParams,
  PaginatedResponse,
  Category,
  ProductPreview,
  Product,
  OnlineStore,
} from 'app/api/types';

export function fetchProducts({
  organizationSlug,
  category = null,
  limit = null,
  offset = null,
  cancelToken = null,
}: {
  category?: Category;
} & OrganizationSlugParams &
  PaginationParams) {
  return axios.get<PaginatedResponse<ProductPreview>>(
    `${API_ROOT}/api/organizations/${organizationSlug}/products/`,
    {
      params: {
        category,
        limit,
        offset,
      },
      cancelToken: cancelToken?.token,
    }
  );
}

export function fetchProduct({
  organizationSlug,
  productSlug,
  cancelToken = null,
}: ProductSlugParams) {
  return axios.get<Product>(
    `${API_ROOT}/api/organizations/${organizationSlug}/products/${productSlug}/`,
    { cancelToken: cancelToken?.token }
  );
}

export function fetchOnlineStores({
  organizationSlug,
  productSlug,
  cancelToken = null,
}: ProductSlugParams) {
  return axios.get<OnlineStore[]>(
    `${API_ROOT}/api/organizations/${organizationSlug}/products/${productSlug}/online-stores/`,
    { cancelToken: cancelToken?.token }
  );
}
