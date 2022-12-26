import axios from 'axios';
import { API_ROOT, PRODUCT_CATEGORY_ALL_KEY } from 'core/constants';
import type {
  CancelTokenParams,
  PaginationWithCancelTokenParams,
  Category,
  PaginatedResponse,
  OrganizationPreview,
  ProductPreview,
  BlogPostPreview,
} from 'core/api/types';

export function fetchPromotedOrganizations({
  limit = null,
  offset = null,
  cancelToken = null,
}: PaginationWithCancelTokenParams = {}) {
  return axios.get<PaginatedResponse<OrganizationPreview>>(
    encodeURI(`${API_ROOT}/api/promoted/organizations/`),
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
  return axios.get<Category[]>(
    encodeURI(`${API_ROOT}/api/promoted/categories/`),
    {
      cancelToken: cancelToken?.token,
    }
  );
}

export type FetchPromotedProductsParams = {
  category?: Category;
  search?: string;
} & PaginationWithCancelTokenParams;
export function fetchPromotedProducts({
  category = null,
  search = null,
  limit = null,
  offset = null,
  cancelToken = null,
}: FetchPromotedProductsParams = {}) {
  return axios.get<PaginatedResponse<ProductPreview>>(
    encodeURI(`${API_ROOT}/api/promoted/products/`),
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

export function fetchPromotedBlogPosts({
  limit = null,
  offset = null,
  cancelToken = null,
}: PaginationWithCancelTokenParams = {}) {
  return axios.get<PaginatedResponse<BlogPostPreview>>(
    encodeURI(`${API_ROOT}/api/promoted/blog_posts/`),
    {
      params: {
        limit,
        offset,
      },
      cancelToken: cancelToken?.token,
    }
  );
}
