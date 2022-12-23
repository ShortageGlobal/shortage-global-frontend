import axios from 'axios';
import { API_ROOT } from 'core/constants';
import type {
  CancelTokenParams,
  Organization,
  Product,
  BlogPost,
} from 'core/api/types';

export async function fetchOrganizationSlugs({
  cancelToken = null,
}: CancelTokenParams = {}) {
  return axios.get<{ slug: Organization['slug'] }[]>(
    encodeURI(`${API_ROOT}/api/sitemap/all_organization_slugs/`),
    { cancelToken: cancelToken?.token }
  );
}

export async function fetchProductSlugs({
  cancelToken = null,
}: CancelTokenParams = {}) {
  return axios.get<
    { slug: Product['slug']; organization: { slug: Organization['slug'] } }[]
  >(encodeURI(`${API_ROOT}/api/sitemap/all_product_slugs/`), {
    cancelToken: cancelToken?.token,
  });
}

export async function fetchBlogPostSlugs({
  cancelToken = null,
}: CancelTokenParams = {}) {
  return axios.get<
    { slug: BlogPost['slug']; organization: { slug: Organization['slug'] } }[]
  >(encodeURI(`${API_ROOT}/api/sitemap/all_blog_post_slugs/`), {
    cancelToken: cancelToken?.token,
  });
}
