import axios from 'axios';
import { API_ROOT, PRODUCT_CATEGORY_ALL_KEY } from 'core/constants';
import type {
  OrganizationSlugParams,
  PaginationParams,
  ProductSlugParams,
  PaginatedResponse,
  Campaign,
  Category,
  ProductPreview,
  Product,
} from 'core/api/types';

export type FetchCampaignProductsParams = OrganizationSlugParams & {
  campaignSlug: Campaign['slug'];
  campaignUuid: Campaign['uuid'];
  category?: Category;
  search?: string;
} & PaginationParams;
export function fetchCampaignProducts({
  organizationSlug,
  campaignSlug,
  campaignUuid,
  category = null,
  search = null,
  limit = null,
  offset = null,
  accessToken = null,
  cancelToken = null,
}: FetchCampaignProductsParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<PaginatedResponse<ProductPreview>>(
    encodeURI(
      `${API_ROOT}/api/organizations/${organizationSlug}/campaigns/${campaignSlug}/${campaignUuid}/products/`
    ),
    {
      params: {
        category: category !== PRODUCT_CATEGORY_ALL_KEY ? category : null,
        search: search.trim() !== '' ? search : null,
        limit,
        offset,
      },
      cancelToken: cancelToken?.token,
      headers,
    }
  );
}

export type FetchCampaignProductParams = {
  campaignSlug: Campaign['slug'];
  campaignUuid: Campaign['uuid'];
} & ProductSlugParams;
export function fetchCampaignProduct({
  organizationSlug,
  campaignSlug,
  campaignUuid,
  productSlug,
  accessToken = null,
  cancelToken = null,
}: FetchCampaignProductParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<Product>(
    encodeURI(
      `${API_ROOT}/api/organizations/${organizationSlug}/campaigns/${campaignSlug}/${campaignUuid}/products/${productSlug}/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}
