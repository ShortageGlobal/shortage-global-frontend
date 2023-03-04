import axios from 'axios';
import { API_ROOT } from 'core/constants';
import type {
  OrganizationSlugParams,
  CancelTokenParams,
  Organization,
  Category,
  Instruction,
} from 'core/api/types';

export type FetchOrganizationParams = OrganizationSlugParams;
export async function fetchOrganization({
  organizationSlug,
  accessToken = null,
  cancelToken = null,
}: FetchOrganizationParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<Organization>(
    encodeURI(`${API_ROOT}/api/organizations/${organizationSlug}/`),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type FetchCategoriesParams = OrganizationSlugParams;
export async function fetchCategories({
  organizationSlug,
  accessToken = null,
  cancelToken = null,
}: OrganizationSlugParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<Category[]>(
    encodeURI(`${API_ROOT}/api/organizations/${organizationSlug}/categories/`),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type FetchInstructionsForOrganizationParams = OrganizationSlugParams;
export async function fetchInstructionsForOrganization({
  organizationSlug,
  accessToken = null,
  cancelToken = null,
}: OrganizationSlugParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<Instruction[]>(
    encodeURI(
      `${API_ROOT}/api/organizations/${organizationSlug}/instructions/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type FetchInstructionsParams = CancelTokenParams & {
  organizationSlugs: Organization['slug'][];
  accessToken?: string;
};
export async function fetchInstructions({
  organizationSlugs,
  accessToken = null,
  cancelToken = null,
}: FetchInstructionsParams) {
  const result: Record<Organization['slug'], Instruction[]> = {};
  await Promise.all(
    organizationSlugs.map((organizationSlug) =>
      fetchInstructionsForOrganization({
        organizationSlug,
        accessToken,
        cancelToken,
      }).then((response) => {
        result[organizationSlug] = response.data;
      })
    )
  );
  return result;
}
