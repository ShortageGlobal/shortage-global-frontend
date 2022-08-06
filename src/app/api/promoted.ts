import axios from 'axios';
import { API_ROOT } from 'app/constants';
import type {
  CancelTokenParams,
  PaginationWithCancelTokenParams,
  Category,
  PaginatedResponse,
  OrganizationPreview,
  ProductPreview,
} from 'app/api/types';

export function fetchPromotedOrganizations({
  limit = null,
  offset = null,
  cancelToken = null,
}: PaginationWithCancelTokenParams = {}) {
  return axios.get<PaginatedResponse<OrganizationPreview>>(
    `${API_ROOT}/api/promoted/organizations/`,
    {
      params: {
        limit,
        offset,
      },
      cancelToken: cancelToken?.token,
    }
  );
}

export function fetchPromotedCategories({
  cancelToken = null,
}: CancelTokenParams = {}) {
  return axios.get<Category[]>(`${API_ROOT}/api/promoted/categories/`, {
    cancelToken: cancelToken?.token,
  });
}

export type FetchPromotedProductsParams = {
  category?: Category;
} & PaginationWithCancelTokenParams;

export function fetchPromotedProducts({
  category = null,
  limit = null,
  offset = null,
  cancelToken = null,
}: FetchPromotedProductsParams = {}) {
  return axios.get<PaginatedResponse<ProductPreview>>(
    `${API_ROOT}/api/promoted/products/`,
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
