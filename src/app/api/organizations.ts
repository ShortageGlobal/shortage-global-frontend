import axios from 'axios';
import { API_ROOT } from 'app/constants';
import type {
  OrganizationSlugParams,
  Organization,
  Category,
  Instruction,
} from 'app/api/types';

export type FetchOrganizationParams = OrganizationSlugParams;
export function fetchOrganization({
  organizationSlug,
  cancelToken = null,
}: FetchOrganizationParams) {
  return axios.get<Organization>(
    encodeURI(`${API_ROOT}/api/organizations/${organizationSlug}/`),
    { cancelToken: cancelToken?.token }
  );
}

export type FetchCategoriesParams = OrganizationSlugParams;
export function fetchCategories({
  organizationSlug,
  cancelToken = null,
}: OrganizationSlugParams) {
  return axios.get<Category[]>(
    encodeURI(`${API_ROOT}/api/organizations/${organizationSlug}/categories/`),
    { cancelToken: cancelToken?.token }
  );
}

export type FetchInstructionsParams = OrganizationSlugParams;
export function fetchInstructions({
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
