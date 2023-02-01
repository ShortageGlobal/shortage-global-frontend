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
