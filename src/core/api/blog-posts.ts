import axios from 'axios';
import { API_ROOT } from 'core/constants';
import type {
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
  cancelToken = null,
}: FetchOrganizationBlogPostsParams) {
  return axios.get<PaginatedResponse<BlogPostPreview>>(
    encodeURI(`${API_ROOT}/api/organizations/${organizationSlug}/blog_posts/`),
    { params: { limit, offset }, cancelToken: cancelToken?.token }
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
