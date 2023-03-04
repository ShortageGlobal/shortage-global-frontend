import axios from 'axios';
import { API_ROOT } from 'core/constants';
import type {
  CancelTokenParams,
  OrganizationSlugParams,
  PaginationParams,
  PaginatedResponse,
  BlogPost,
  BlogPostPreview,
} from 'core/api/types';

export type FetchPackageBlogPostsParams = {
  packageId: string;
  accessToken?: string;
} & OrganizationSlugParams;
export function fetchPackageBlogPosts({
  organizationSlug,
  packageId,
  accessToken = null,
  cancelToken = null,
}: FetchPackageBlogPostsParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<BlogPostPreview[]>(
    encodeURI(
      `${API_ROOT}/api/organizations/${organizationSlug}/packages/${packageId}/blog_posts/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type FetchOrganizationBlogPostsParams = OrganizationSlugParams &
  PaginationParams;
export function fetchOrganizationBlogPosts({
  organizationSlug,
  limit = null,
  offset = null,
  accessToken = null,
  cancelToken = null,
}: FetchOrganizationBlogPostsParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<PaginatedResponse<BlogPostPreview>>(
    encodeURI(`${API_ROOT}/api/organizations/${organizationSlug}/blog_posts/`),
    { params: { limit, offset }, cancelToken: cancelToken?.token, headers }
  );
}

export type FetchOrganizationBlogPostParams = {
  accessToken?: string;
  blogPostSlug: BlogPost['slug'];
} & OrganizationSlugParams;
export function fetchOrganizationBlogPost({
  organizationSlug,
  blogPostSlug,
  accessToken = null,
  cancelToken = null,
}: FetchOrganizationBlogPostParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<BlogPost>(
    encodeURI(
      `${API_ROOT}/api/organizations/${organizationSlug}/blog_posts/${blogPostSlug}/`
    ),
    { cancelToken: cancelToken?.token, headers }
  );
}

export type FetchAccountPackageBlogPostsParams = {
  accessToken?: string;
} & CancelTokenParams;
export function fetchAccountPackageBlogPosts({
  accessToken = null,
  cancelToken = null,
}: FetchAccountPackageBlogPostsParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<BlogPostPreview[]>(
    encodeURI(`${API_ROOT}/api/private/package_blog_posts/`),
    { cancelToken: cancelToken?.token, headers }
  );
}
