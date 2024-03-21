import axios from 'axios';
import { API_ROOT } from 'core/constants';
import type {
  Slug,
  CancelTokenParams,
  PaginationWithCancelTokenParams,
  PaginatedResponse,
  ShortageBlogPostPreview,
  ShortageBlogPost,
} from 'core/api/types';

export type FetchShortageBlogPostsParams = PaginationWithCancelTokenParams;
export function fetchShortageBlogPosts({
  limit = null,
  offset = null,
  cancelToken = null,
}: FetchShortageBlogPostsParams = {}) {
  return axios.get<PaginatedResponse<ShortageBlogPostPreview>>(
    encodeURI(`${API_ROOT}/api/blog_posts/`),
    {
      params: { limit, offset },
      cancelToken: cancelToken?.token,
    }
  );
}

export type FetchShortageBlogPostParams = {
  blogPostSlug: Slug;
  accessToken?: string;
} & CancelTokenParams;
export function fetchShortageBlogPost({
  blogPostSlug,
  accessToken = null,
  cancelToken = null,
}: FetchShortageBlogPostParams) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return axios.get<ShortageBlogPost>(
    encodeURI(`${API_ROOT}/api/blog_posts/${blogPostSlug}/`),
    { cancelToken: cancelToken?.token, headers }
  );
}
