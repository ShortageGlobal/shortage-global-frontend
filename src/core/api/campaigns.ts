import axios from 'axios';
import { API_ROOT } from 'core/constants';
import type {
  OrganizationSlugParams,
  PaginationParams,
  PaginatedResponse,
  Campaign,
  CampaignPreview,
  Category,
} from 'core/api/types';

export type FetchCampaignsParams = OrganizationSlugParams & PaginationParams;
export function fetchCampaigns({
  organizationSlug,
  limit = null,
  offset = null,
  accessToken = null,
  cancelToken = null,
}: FetchCampaignsParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<PaginatedResponse<CampaignPreview>>(
    encodeURI(`${API_ROOT}/api/organizations/${organizationSlug}/campaigns/`),
    { params: { limit, offset }, cancelToken: cancelToken?.token, headers }
  );
}

export type FetchCampaignParams = {
  campaignSlug: Campaign['slug'];
  campaignUuid: Campaign['uuid'];
} & OrganizationSlugParams;
export function fetchCampaign({
  organizationSlug,
  campaignSlug,
  campaignUuid,
  accessToken = null,
  cancelToken = null,
}: FetchCampaignParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<Campaign>(
    encodeURI(
      `${API_ROOT}/api/organizations/${organizationSlug}/campaigns/${campaignSlug}/${campaignUuid}/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type FetchCampaignCategoriesParams = {
  campaignSlug: Campaign['slug'];
  campaignUuid: Campaign['uuid'];
} & OrganizationSlugParams;
export async function fetchCampaignCategories({
  organizationSlug,
  campaignSlug,
  campaignUuid,
  accessToken = null,
  cancelToken = null,
}: FetchCampaignCategoriesParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<Category[]>(
    encodeURI(
      `${API_ROOT}/api/organizations/${organizationSlug}/campaigns/${campaignSlug}/${campaignUuid}/categories/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}
