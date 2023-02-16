import axios from 'axios';
import { API_ROOT, PRODUCT_CATEGORY_ALL_KEY } from 'core/constants';
import {
  Category,
  CancelTokenParams,
  PaginationParams,
  PaginatedResponse,
  AccountOrganization,
  AccountProduct,
  AccountDeliveryInstruction,
} from 'core/api/types';

type UploadImageParams = {
  file: File;
  accessToken?: string;
} & CancelTokenParams;
export async function uploadImage({
  file,
  accessToken = null,
  cancelToken = null,
}: UploadImageParams) {
  const headers = { 'Content-Type': 'multipart/form-data' };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return axios
    .post(
      encodeURI(`${API_ROOT}/api/private/upload_image/`),
      { file },
      { cancelToken: cancelToken?.token, headers }
    )
    .then((response) => {
      let location = response.data.location;

      if (!location.startsWith('http')) {
        // On production, the absolute path to S3 is returned.
        // On development, the relative path is returned, e.g. "/media/...".
        // We need an absolute path to fetch and preview the image.
        location = `${API_ROOT}${location}`;
      }

      return location;
    });
}

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
  organizationSlug: AccountOrganization['slug'];
  name?: AccountOrganization['name'];
  slug?: AccountOrganization['slug'];
  logo?: File | string;
  banner?: File | string;
  url?: AccountOrganization['url'];
  description?: AccountOrganization['description'];
  metaDescription?: AccountOrganization['meta_description'];
  einNumber?: AccountOrganization['ein_number'];
} & CancelTokenParams;
export async function updateAccountOrganization({
  organizationSlug,
  name,
  slug,
  logo,
  banner,
  url,
  description,
  metaDescription,
  einNumber,
  cancelToken = null,
}: UpdateAccountOrganizationParams) {
  return axios.patch<AccountOrganization>(
    encodeURI(`${API_ROOT}/api/private/organizations/${organizationSlug}/`),
    {
      name,
      slug,
      logo,
      banner,
      url,
      description,
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

export type FetchAccountDeliveryInstructionsParams = {
  organizationSlug: AccountOrganization['slug'];
  accessToken?: string;
} & CancelTokenParams;
export async function fetchAccountDeliveryInstructions({
  organizationSlug,
  accessToken = null,
  cancelToken = null,
}: FetchAccountDeliveryInstructionsParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<AccountDeliveryInstruction[]>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/instructions/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type CreateAccountDeliveryInstructionsParams = {
  organizationSlug: AccountOrganization['slug'];
  name: AccountDeliveryInstruction['name'];
  description: AccountDeliveryInstruction['description'];
} & CancelTokenParams;
export async function createAccountDeliveryInstruction({
  organizationSlug,
  name,
  description,
  cancelToken = null,
}: CreateAccountDeliveryInstructionsParams) {
  return axios.post<AccountDeliveryInstruction>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/instructions/`
    ),
    { name, description },
    { cancelToken: cancelToken?.token }
  );
}

export type UpdateAccountDeliveryInstructionsParams = {
  organizationSlug: AccountOrganization['slug'];
  id: AccountDeliveryInstruction['id'];
  name: AccountDeliveryInstruction['name'];
  description: AccountDeliveryInstruction['description'];
} & CancelTokenParams;
export async function updateAccountDeliveryInstruction({
  organizationSlug,
  id,
  name,
  description,
  cancelToken = null,
}: UpdateAccountDeliveryInstructionsParams) {
  return axios.put<AccountDeliveryInstruction>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/instructions/${id}/`
    ),
    { name, description },
    { cancelToken: cancelToken?.token }
  );
}

export type FetchAccountOrganizationProductsParams = {
  organizationSlug: AccountOrganization['slug'];
  category?: Category;
  search?: string;
  accessToken?: string;
} & PaginationParams &
  CancelTokenParams;
export async function fetchAccountOrganizationProducts({
  organizationSlug,
  category = null,
  search = null,
  limit = null,
  offset = null,
  accessToken = null,
  cancelToken = null,
}: FetchAccountOrganizationProductsParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<PaginatedResponse<AccountProduct>>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/products/`
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
