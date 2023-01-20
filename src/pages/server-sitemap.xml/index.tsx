// pages/server-sitemap-index.xml/index.tsx
import { getServerSideSitemap } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import {
  fetchOrganizationSlugs,
  fetchProductSlugs,
  fetchBlogPostSlugs,
} from 'core/api';
import { ROOT_URL } from 'core/constants';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // fetch slugs
  const [{ data: organizations }, { data: products }, { data: blogPosts }] =
    await Promise.all([
      fetchOrganizationSlugs(),
      fetchProductSlugs(),
      fetchBlogPostSlugs(),
    ]);

  const lastmod = new Date().toISOString();

  const fields = [
    ...organizations.map(({ slug }) => {
      return {
        loc: `${ROOT_URL}/${slug}/`,
        lastmod,
      };
    }),
    ...products.map(({ slug, organization }) => {
      return {
        loc: `${ROOT_URL}/${organization.slug}/products/${slug}/`,
        lastmod,
      };
    }),
    ...blogPosts.map(({ slug, organization }) => {
      return {
        loc: `${ROOT_URL}/${organization.slug}/impact-stories/${slug}/`,
        lastmod,
      };
    }),
  ];

  return getServerSideSitemap(ctx, fields);
};

export default function SitemapIndex() {
  // Default export to prevent next.js errors
}
