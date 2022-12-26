import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useAppDispatch, useAppSelector, useCancelToken } from 'core/hooks';
import {
  fetchPromotedBlogPosts,
  selectPromotedBlogPosts,
  setIsLoading,
} from 'core/store/slices/promoted-blog-posts';
import { BlogPosts } from 'components/blog-posts/blog-posts';
import { BLOG_POSTS_PAGE_SIZE } from 'core/constants';

export function PromotedBlogPosts() {
  const dispatch = useAppDispatch();
  const { promotedBlogPosts, count, isLoading } = useAppSelector(
    selectPromotedBlogPosts
  );
  const getFetchPromotedBlogPostsCancelToken = useCancelToken();

  const debouncedFetchPromotedBlogPosts = useDebouncedCallback(
    ({
      offset = 0,
      limit = BLOG_POSTS_PAGE_SIZE,
    }: {
      offset?: number;
      limit?: number;
    }) => {
      // fetch promotedBlogPosts
      const cancelToken = getFetchPromotedBlogPostsCancelToken();
      dispatch(
        fetchPromotedBlogPosts({
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
    debouncedFetchPromotedBlogPosts({
      offset: promotedBlogPosts.length,
      limit: BLOG_POSTS_PAGE_SIZE,
    });
  }, [promotedBlogPosts]);

  return (
    <BlogPosts
      blogPosts={promotedBlogPosts}
      count={count}
      isLoading={isLoading}
      onShowMore={handleShowMore}
    />
  );
}
