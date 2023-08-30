import axios from 'axios';
import { API_ROOT, PRODUCT_CATEGORY_ALL_KEY } from 'core/constants';
import {
  Category,
  CancelTokenParams,
  PaginationParams,
  PaginatedResponse,
  AccountOrganization,
  AccountProduct,
  AccountCampaign,
  AccountDeliveryInstruction,
  AccountBlogPost,
  AccountOrganizationPackage,
  OrganizationChecklist,
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

export type PublishAccountOrganizationParams = {
  organizationSlug: AccountOrganization['slug'];
  accessToken?: string;
} & CancelTokenParams;
export async function publishAccountOrganization({
  organizationSlug,
  accessToken = null,
  cancelToken = null,
}: PublishAccountOrganizationParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.post<AccountOrganization>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/publish/`
    ),
    {},
    { cancelToken: cancelToken?.token, headers }
  );
}

export type DeleteAccountOrganizationParams = {
  organizationSlug: AccountOrganization['slug'];
  accessToken?: string;
} & CancelTokenParams;
export async function deleteAccountOrganization({
  organizationSlug,
  accessToken = null,
  cancelToken = null,
}: DeleteAccountOrganizationParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.delete(
    encodeURI(`${API_ROOT}/api/private/organizations/${organizationSlug}/`),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type UnpublishAccountOrganizationParams = {
  organizationSlug: AccountOrganization['slug'];
  accessToken?: string;
} & CancelTokenParams;
export async function unpublishAccountOrganization({
  organizationSlug,
  accessToken = null,
  cancelToken = null,
}: UnpublishAccountOrganizationParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.post<AccountOrganization>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/unpublish/`
    ),
    {},
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
  requestedGoods?: AccountOrganization['requested_goods'];
  missionDescription?: AccountOrganization['mission_description'];
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
  representativeUrl?: AccountOrganization['representative_url'];
  representativePhoneNumber?: AccountOrganization['representative_phone_number'];
  representativeSignature?: File | string;
  receiptPreamble?: string;
  receiptLegalInformation?: string;
} & CancelTokenParams;
export async function updateAccountOrganization({
  organizationSlug,
  name,
  slug,
  logo,
  banner,
  url,
  description,
  requestedGoods,
  missionDescription,
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
  representativeUrl,
  representativePhoneNumber,
  representativeSignature,
  receiptPreamble,
  receiptLegalInformation,
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
      requested_goods: requestedGoods,
      mission_description: missionDescription,
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
      representative_url: representativeUrl,
      representative_phone_number: representativePhoneNumber,
      representative_signature: representativeSignature,
      tax_deduction_receipt_preamble: receiptPreamble,
      tax_deduction_receipt_legal_information: receiptLegalInformation,
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

export type FetchOrganizationPublishChecklistParams = {
  organizationSlug: AccountOrganization['slug'];
  accessToken?: string;
} & CancelTokenParams;
export async function fetchOrganizationPublishChecklist({
  organizationSlug,
  accessToken = null,
  cancelToken = null,
}: FetchOrganizationPublishChecklistParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<{ checklist: OrganizationChecklist; can_publish: boolean }>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/checklist/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type CreateAccountDeliveryInstructionsParams = {
  organizationSlug: AccountOrganization['slug'];
  name: AccountDeliveryInstruction['name'];
  addressLine1: AccountDeliveryInstruction['address_line1'];
  addressLine2: AccountDeliveryInstruction['address_line2'];
  city: AccountDeliveryInstruction['city'];
  stateProvinceRegion: AccountDeliveryInstruction['state_province_region'];
  zip: AccountDeliveryInstruction['zip'];
  phoneNumber: AccountDeliveryInstruction['phone_number'];
  comment: AccountDeliveryInstruction['comment'];
} & CancelTokenParams;
export async function createAccountDeliveryInstruction({
  organizationSlug,
  name,
  addressLine1,
  addressLine2,
  city,
  stateProvinceRegion,
  zip,
  phoneNumber,
  comment,
  cancelToken = null,
}: CreateAccountDeliveryInstructionsParams) {
  return axios.post<AccountDeliveryInstruction>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/instructions/`
    ),
    {
      name,
      description: 'obsolete field', // TODO: remove description field
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state_province_region: stateProvinceRegion,
      zip,
      phone_number: phoneNumber,
      comment,
    },
    { cancelToken: cancelToken?.token }
  );
}

export type UpdateAccountDeliveryInstructionsParams = {
  organizationSlug: AccountOrganization['slug'];
  id: AccountDeliveryInstruction['id'];
  name: AccountDeliveryInstruction['name'];
  addressLine1: AccountDeliveryInstruction['address_line1'];
  addressLine2: AccountDeliveryInstruction['address_line2'];
  city: AccountDeliveryInstruction['city'];
  stateProvinceRegion: AccountDeliveryInstruction['state_province_region'];
  zip: AccountDeliveryInstruction['zip'];
  phoneNumber: AccountDeliveryInstruction['phone_number'];
  comment: AccountDeliveryInstruction['comment'];
} & CancelTokenParams;
export async function updateAccountDeliveryInstruction({
  organizationSlug,
  id,
  name,
  addressLine1,
  addressLine2,
  city,
  stateProvinceRegion,
  zip,
  phoneNumber,
  comment,
  cancelToken = null,
}: UpdateAccountDeliveryInstructionsParams) {
  return axios.put<AccountDeliveryInstruction>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/instructions/${id}/`
    ),
    {
      name,
      description: 'obsolete field', // TODO: remove description field
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state_province_region: stateProvinceRegion,
      zip,
      phone_number: phoneNumber,
      comment,
    },
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
  isPublic: AccountProduct['is_public'];
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
  isPublic,
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
      is_public: isPublic,
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
  isPublic: AccountProduct['is_public'];
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
  isPublic,
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
      is_public: isPublic,
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

export type FetchAccountCampaignsParams = {
  organizationSlug: AccountOrganization['slug'];
  search?: string;
  accessToken?: string;
} & PaginationParams &
  CancelTokenParams;
export async function fetchAccountCampaigns({
  organizationSlug,
  search = null,
  limit = null,
  offset = null,
  accessToken = null,
  cancelToken = null,
}: FetchAccountCampaignsParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<PaginatedResponse<AccountCampaign>>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/campaigns/`
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

export type UploadTaxDeductionReceiptFileParams = {
  organizationSlug: AccountOrganization['slug'];
  packageId: AccountOrganizationPackage['uuid'];
  tax_deduction_receipt: File;
  accessToken?: string;
} & CancelTokenParams;
export async function uploadTaxDeductionReceiptFile({
  organizationSlug,
  packageId,
  tax_deduction_receipt,
  accessToken = null,
  cancelToken = null,
}: UploadTaxDeductionReceiptFileParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.post(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/packages/${packageId}/upload_tax_deduction_receipt/`
    ),
    { tax_deduction_receipt },
    {
      cancelToken: cancelToken?.token,
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

export type GenerateTaxDeductionReceiptFileParams = {
  organizationSlug: AccountOrganization['slug'];
  packageId: AccountOrganizationPackage['uuid'];
  accessToken?: string;
} & CancelTokenParams;
export async function generateTaxDeductionReceiptFile({
  organizationSlug,
  packageId,
  accessToken = null,
  cancelToken = null,
}: GenerateTaxDeductionReceiptFileParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.post(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/packages/${packageId}/generate_tax_deduction_receipt/`
    ),
    {},
    {
      cancelToken: cancelToken?.token,
      headers,
    }
  );
}

export type MarkPackageAsDeliveredParams = {
  organizationSlug: AccountOrganization['slug'];
  packageId: AccountOrganizationPackage['uuid'];
  accessToken?: string;
} & CancelTokenParams;
export async function markPackageAsDelivered({
  organizationSlug,
  packageId,
  accessToken = null,
  cancelToken = null,
}: MarkPackageAsDeliveredParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.post(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/packages/${packageId}/mark_package_as_delivered/`
    ),
    {},
    {
      cancelToken: cancelToken?.token,
      headers,
    }
  );
}

export type SetOrganizationPackageBlogPostsParams = {
  organizationSlug: AccountOrganization['slug'];
  packageId: AccountOrganizationPackage['uuid'];
  blogPostIds: AccountBlogPost['uuid'][];
  accessToken?: string;
} & CancelTokenParams;
export async function setOrganizationPackageBlogPosts({
  organizationSlug,
  packageId,
  blogPostIds,
  accessToken = null,
  cancelToken = null,
}: SetOrganizationPackageBlogPostsParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.post(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/packages/${packageId}/set_blog_posts/`
    ),
    { blog_posts: blogPostIds },
    {
      cancelToken: cancelToken?.token,
      headers,
    }
  );
}

export type FetchOrganizationPackageBlogPostsParams = {
  organizationSlug: AccountOrganization['slug'];
  packageId: AccountOrganizationPackage['uuid'];
  accessToken?: string;
} & CancelTokenParams;
export async function fetchOrganizationPackageBlogPosts({
  organizationSlug,
  packageId,
  accessToken = null,
  cancelToken = null,
}: FetchOrganizationPackageBlogPostsParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<AccountBlogPost[]>(
    encodeURI(
      `${API_ROOT}/api/private/organizations/${organizationSlug}/packages/${packageId}/blog_posts/`
    ),
    {
      cancelToken: cancelToken?.token,
      headers,
    }
  );
}
export type CheckOrganizationSlugIsTakenParams = {
  organizationSlug: AccountOrganization['slug'];
  accessToken?: string;
} & CancelTokenParams;
export async function checkOrganizationSlugIsTaken({
  organizationSlug,
  accessToken = null,
  cancelToken = null,
}: CheckOrganizationSlugIsTakenParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  try {
    await axios.get(
      encodeURI(
        `${API_ROOT}/api/private/exists/organizations/${organizationSlug}/`
      ),
      { cancelToken: cancelToken?.token, headers }
    );
    return true;
  } catch (rejection) {
    // 404 means the organizaion with the given slug not found
    if (rejection.response?.status === 404) {
      return false;
    }
    throw rejection;
  }
}
