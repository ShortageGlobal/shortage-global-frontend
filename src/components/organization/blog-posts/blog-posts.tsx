import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useAppDispatch, useAppSelector, useCancelToken } from 'core/hooks';
import { selectOrganization } from 'core/store/slices/organization';
import {
  fetchOrganizationBlogPosts,
  selectOrganizationBlogPosts,
  setIsLoading,
} from 'core/store/slices/organization-blog-posts';
import { BLOG_POSTS_PAGE_SIZE } from 'core/constants';
import { BlogPosts } from 'components/blog-posts/blog-posts';

export function OrganizationBlogPosts() {
  const dispatch = useAppDispatch();
  const { organization } = useAppSelector(selectOrganization);
  const { organizationBlogPosts, count, isLoading } = useAppSelector(
    selectOrganizationBlogPosts
  );
  const getFetchOrganizationBlogPostsCancelToken = useCancelToken();

  const debouncedFetchOrganizationBlogPosts = useDebouncedCallback(
    ({
      offset = 0,
      limit = BLOG_POSTS_PAGE_SIZE,
    }: {
      offset?: number;
      limit?: number;
    }) => {
      // fetch organizationBlogPosts
      const cancelToken = getFetchOrganizationBlogPostsCancelToken();
      dispatch(
        fetchOrganizationBlogPosts({
          organizationSlug: organization.slug,
          offset,
          limit,
          cancelToken,
        })
      );
    },
    250
  );

  // user clicked "Show more"
  const handleShowMore = useCallback(() => {
    dispatch(setIsLoading(true));
    debouncedFetchOrganizationBlogPosts({
      offset: organizationBlogPosts.length,
      limit: BLOG_POSTS_PAGE_SIZE,
    });
  }, [organizationBlogPosts]);

  return (
    <BlogPosts
      blogPosts={organizationBlogPosts}
      count={count}
      isLoading={isLoading}
      onShowMore={handleShowMore}
    />
  );
}
