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
  AccountBlogPost,
  AccountOrganizationPackage,
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
  deadline?: AccountOrganization['deadline'];
  einNumber?: AccountOrganization['ein_number'];
  addressLine1?: AccountOrganization['address_line1'];
  addressLine2?: AccountOrganization['address_line2'];
  city?: AccountOrganization['city'];
  stateProvinceRegion?: AccountOrganization['state_province_region'];
  zip?: AccountOrganization['zip'];
  country?: AccountOrganization['country'];
  representativeFirstName?: AccountOrganization['representative_first_name'];
  representativeLastName?: AccountOrganization['representative_last_name'];
  representativeEmail?: AccountOrganization['representative_email'];
  representativePhoneNumber?: AccountOrganization['representative_phone_number'];
  representativeSignature?: File | string;
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
  deadline,
  einNumber,
  addressLine1,
  addressLine2,
  city,
  stateProvinceRegion,
  zip,
  country,
  representativeFirstName,
  representativeLastName,
  representativeEmail,
  representativePhoneNumber,
  representativeSignature,
  cancelToken = null,
}: UpdateAccountOrganizationParams) {
  return axios.patch<AccountOrganization>(
    encodeURI(`${API_ROOT}/api/private/organizations/${organizationSlug}/`),
    {
      // nonprofit page
      name,
      slug,
      logo,
      banner,
      url,
      description,
      meta_description: metaDescription,
      deadline,

      // tax deduction
      ein_number: einNumber,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state_province_region: stateProvinceRegion,
      zip,
      country,
      representative_first_name: representativeFirstName,
      representative_last_name: representativeLastName,
      representative_email: representativeEmail,
      representative_phone_number: representativePhoneNumber,
      representative_signature: representativeSignature,
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

export type FetchAccountProductParams = {
  organizationSlug: AccountOrganization['slug'];
  productId: AccountProduct['id'];
  accessToken?: string;
} & CancelTokenParams;
export async function fetchAccountOrganizationProduct({
  organizationSlug,
  productId,
  accessToken = null,
  cancelToken = null,
}: FetchAccountProductParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<AccountProduct>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/products/${productId}/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type DeleteAccountProductParams = {
  organizationSlug: AccountOrganization['slug'];
  productId: AccountProduct['id'];
  accessToken?: string;
} & CancelTokenParams;
export async function deleteAccountOrganizationProduct({
  organizationSlug,
  productId,
  accessToken = null,
  cancelToken = null,
}: DeleteAccountProductParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.delete(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/products/${productId}/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type UpdateAccountOrganizationProductParams = {
  organizationSlug: AccountOrganization['slug'];
  productId: AccountProduct['id'];
  name: AccountProduct['name'];
  slug: AccountProduct['slug'];
  category: AccountProduct['category'];
  photo: File | string;
  price: AccountProduct['price'];
  requestedAmount: AccountProduct['requested_amount'];
  topPriority: AccountProduct['top_priority'];
  description: AccountProduct['description'];
  position: AccountProduct['position'];
} & PaginationParams &
  CancelTokenParams;
export async function updateAccountOrganizationProduct({
  organizationSlug,
  productId,
  name,
  slug,
  category,
  photo,
  price,
  requestedAmount,
  topPriority,
  description,
  position,
  cancelToken = null,
}: UpdateAccountOrganizationProductParams) {
  return axios.put<AccountProduct>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/products/${productId}/`
    ),
    {
      name,
      slug,
      category,
      photo,
      price,
      requested_amount: requestedAmount,
      top_priority: topPriority,
      description,
      position,
    },
    {
      cancelToken: cancelToken?.token,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

export type CreateAccountOrganizationProductParams = {
  organizationSlug: AccountOrganization['slug'];
  name: AccountProduct['name'];
  slug: AccountProduct['slug'];
  category: AccountProduct['category'];
  photo: File | string;
  price: AccountProduct['price'];
  requestedAmount: AccountProduct['requested_amount'];
  topPriority: AccountProduct['top_priority'];
  description: AccountProduct['description'];
  position: AccountProduct['position'];
} & PaginationParams &
  CancelTokenParams;
export async function createAccountOrganizationProduct({
  organizationSlug,
  name,
  slug,
  category,
  photo,
  price,
  requestedAmount,
  topPriority,
  description,
  position,
  cancelToken = null,
}: CreateAccountOrganizationProductParams) {
  return axios.post<AccountProduct>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/products/`
    ),
    {
      name,
      slug,
      category,
      photo,
      price,
      requested_amount: requestedAmount,
      top_priority: topPriority,
      description,
      position,
    },
    {
      cancelToken: cancelToken?.token,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

export type FetchAccountBlogPostsParams = {
  organizationSlug: AccountOrganization['slug'];
  search?: string;
  accessToken?: string;
} & PaginationParams &
  CancelTokenParams;
export async function fetchAccountBlogPosts({
  organizationSlug,
  search = null,
  limit = null,
  offset = null,
  accessToken = null,
  cancelToken = null,
}: FetchAccountBlogPostsParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<PaginatedResponse<AccountBlogPost>>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/blog_posts/`
    ),
    {
      params: {
        search: search.trim() !== '' ? search : null,
        limit,
        offset,
      },
      cancelToken: cancelToken?.token,
      headers,
    }
  );
}

export type FetchAccountBlogPostParams = {
  organizationSlug: AccountOrganization['slug'];
  blogPostUuid: AccountBlogPost['uuid'];
  accessToken?: string;
} & CancelTokenParams;
export async function fetchAccountOrganizationBlogPost({
  organizationSlug,
  blogPostUuid,
  accessToken = null,
  cancelToken = null,
}: FetchAccountBlogPostParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<AccountBlogPost>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/blog_posts/${blogPostUuid}/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type DeleteAccountBlogPostParams = {
  organizationSlug: AccountOrganization['slug'];
  blogPostUuid: AccountBlogPost['uuid'];
  accessToken?: string;
} & CancelTokenParams;
export async function deleteAccountOrganizationBlogPost({
  organizationSlug,
  blogPostUuid,
  accessToken = null,
  cancelToken = null,
}: DeleteAccountBlogPostParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.delete(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/blog_posts/${blogPostUuid}/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type UpdateAccountOrganizationBlogPostParams = {
  organizationSlug: AccountOrganization['slug'];
  blogPostUuid: AccountBlogPost['uuid'];
  title: AccountBlogPost['title'];
  slug: AccountBlogPost['slug'];
  image: File | string;
  content: AccountBlogPost['content'];
  metaDescription: AccountBlogPost['meta_description'];
  isDraft: AccountBlogPost['is_draft'];
} & PaginationParams &
  CancelTokenParams;
export async function updateAccountOrganizationBlogPost({
  organizationSlug,
  blogPostUuid,
  title,
  slug,
  image,
  content,
  metaDescription,
  isDraft,
  cancelToken = null,
}: UpdateAccountOrganizationBlogPostParams) {
  return axios.put<AccountBlogPost>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/blog_posts/${blogPostUuid}/`
    ),
    {
      title,
      slug,
      image,
      content,
      meta_description: metaDescription,
      is_draft: isDraft,
    },
    {
      cancelToken: cancelToken?.token,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

export type CreateAccountOrganizationBlogPostParams = {
  organizationSlug: AccountOrganization['slug'];
  title: AccountBlogPost['title'];
  slug: AccountBlogPost['slug'];
  image: File | string;
  content: AccountBlogPost['content'];
  metaDescription: AccountBlogPost['meta_description'];
  isDraft: AccountBlogPost['is_draft'];
} & PaginationParams &
  CancelTokenParams;
export async function createAccountOrganizationBlogPost({
  organizationSlug,
  title,
  slug,
  image,
  content,
  metaDescription,
  isDraft,
  cancelToken = null,
}: CreateAccountOrganizationBlogPostParams) {
  return axios.post<AccountBlogPost>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/blog_posts/`
    ),
    {
      title,
      slug,
      image,
      content,
      meta_description: metaDescription,
      is_draft: isDraft,
    },
    {
      cancelToken: cancelToken?.token,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

export type FetchAccountOrganizationPackagesParams = {
  organizationSlug: AccountOrganization['slug'];
  accessToken?: string;
} & PaginationParams &
  CancelTokenParams;
export async function fetchAccountOrganizationPackages({
  organizationSlug,
  limit = null,
  offset = null,
  accessToken = null,
  cancelToken = null,
}: FetchAccountOrganizationPackagesParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<PaginatedResponse<AccountOrganizationPackage>>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/packages/`
    ),
    {
      params: {
        limit,
        offset,
      },
      cancelToken: cancelToken?.token,
      headers,
    }
  );
}

export type FetchAccountOrganizationPackageParams = {
  organizationSlug: AccountOrganization['slug'];
  packageId: AccountOrganizationPackage['uuid'];
  accessToken?: string;
} & CancelTokenParams;
export async function fetchAccountOrganizationPackage({
  organizationSlug,
  packageId,
  accessToken = null,
  cancelToken = null,
}: FetchAccountOrganizationPackageParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<AccountOrganizationPackage>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/packages/${packageId}/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}
