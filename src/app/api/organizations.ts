import axios from 'axios';
import { API_ROOT } from 'app/constants';
import type {
  OrganizationSlugParams,
  CancelTokenParams,
  Organization,
  Category,
  Instruction,
} from 'app/api/types';

export type FetchOrganizationParams = OrganizationSlugParams;
export async function fetchOrganization({
  organizationSlug,
  cancelToken = null,
}: FetchOrganizationParams) {
  return axios.get<Organization>(
    encodeURI(`${API_ROOT}/api/organizations/${organizationSlug}/`),
    { cancelToken: cancelToken?.token }
  );
}

export type FetchCategoriesParams = OrganizationSlugParams;
export async function fetchCategories({
  organizationSlug,
  cancelToken = null,
}: OrganizationSlugParams) {
  return axios.get<Category[]>(
    encodeURI(`${API_ROOT}/api/organizations/${organizationSlug}/categories/`),
    { cancelToken: cancelToken?.token }
  );
}

export type FetchInstructionsForOrganizationParams = OrganizationSlugParams;
export async function fetchInstructionsForOrganization({
  organizationSlug,
  cancelToken = null,
}: OrganizationSlugParams) {
  return axios.get<Instruction[]>(
    encodeURI(
      `${API_ROOT}/api/organizations/${organizationSlug}/instructions/`
    ),
    { cancelToken: cancelToken?.token }
  );
}

export type FetchInstructionsParams = CancelTokenParams & {
  organizationSlugs: Organization['slug'][];
};
export async function fetchInstructions({
  organizationSlugs,
  cancelToken = null,
}: FetchInstructionsParams) {
  const result: Record<Organization['slug'], Instruction[]> = {};
  await Promise.all(
    organizationSlugs.map((organizationSlug) =>
      fetchInstructionsForOrganization({ organizationSlug, cancelToken }).then(
        (response) => {
          result[organizationSlug] = response.data;
        }
      )
    )
  );
  return result;
}
