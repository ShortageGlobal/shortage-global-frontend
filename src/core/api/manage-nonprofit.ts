import axios from 'axios';
import { API_ROOT } from 'core/constants';
import type { CancelTokenParams, AccountOrganization } from 'core/api/types';

type FetchAccountOrganizationsParams = {
  accessToken?: string;
} & CancelTokenParams;
export async function fetchAccountOrganizations({
  accessToken = null,
  cancelToken = null,
}: FetchAccountOrganizationsParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<AccountOrganization[]>(
    encodeURI(`${API_ROOT}/api/private/organizations/`),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type FetchAccountOrganizationParams = {
  organizationSlug: AccountOrganization['slug'];
  accessToken?: string;
} & CancelTokenParams;
export async function fetchAccountOrganization({
  organizationSlug,
  accessToken = null,
  cancelToken = null,
}: FetchAccountOrganizationParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<AccountOrganization>(
    encodeURI(`${API_ROOT}/api/private/organizations/${organizationSlug}/`),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type RegisterAccountOrganizationParams = {
  name: AccountOrganization['name'];
  slug: AccountOrganization['slug'];
} & CancelTokenParams;
export async function registerAccountOrganization({
  name,
  slug,
  cancelToken = null,
}: RegisterAccountOrganizationParams) {
  return axios.post<AccountOrganization>(
    encodeURI(`${API_ROOT}/api/private/organizations/`),
    { name, slug },
    { cancelToken: cancelToken?.token }
  );
}

export type UpdateAccountOrganizationParams = {
  originalSlug: AccountOrganization['slug'];
  name?: AccountOrganization['name'];
  slug?: AccountOrganization['slug'];
  logo?: File | string;
  banner?: File | string;
  url?: AccountOrganization['url'];
  metaDescription?: AccountOrganization['meta_description'];
  einNumber?: AccountOrganization['ein_number'];
} & CancelTokenParams;
export async function updateAccountOrganization({
  originalSlug,
  name,
  slug,
  logo,
  banner,
  url,
  metaDescription,
  einNumber,
  cancelToken = null,
}: UpdateAccountOrganizationParams) {
  return axios.patch<AccountOrganization>(
    encodeURI(`${API_ROOT}/api/private/organizations/${originalSlug}/`),
    {
      name,
      slug,
      logo,
      banner,
      url,
      meta_description: metaDescription,
      ein_number: einNumber,
    },
    {
      cancelToken: cancelToken?.token,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}
