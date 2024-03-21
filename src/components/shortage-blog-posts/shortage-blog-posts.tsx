import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useAppDispatch, useAppSelector, useCancelToken } from 'core/hooks';
import {
  fetchShortageBlogPosts,
  selectShortageBlogPosts,
  setIsLoading,
} from 'core/store/slices/shortage-blog-posts';
import { BlogPosts } from 'components/blog-posts/blog-posts';
import { BLOG_POSTS_PAGE_SIZE } from 'core/constants';

export function ShortageBlogPosts() {
  const dispatch = useAppDispatch();
  const { shortageBlogPosts, count, isLoading } = useAppSelector(
    selectShortageBlogPosts
  );
  const getFetchShortageBlogPostsCancelToken = useCancelToken();

  const debouncedFetchShortageBlogPosts = useDebouncedCallback(
    ({
      offset = 0,
      limit = BLOG_POSTS_PAGE_SIZE,
    }: {
      offset?: number;
      limit?: number;
    }) => {
      // fetch shortageBlogPosts
      const cancelToken = getFetchShortageBlogPostsCancelToken();
      dispatch(
        fetchShortageBlogPosts({
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
    debouncedFetchShortageBlogPosts({
      offset: shortageBlogPosts.length,
      limit: BLOG_POSTS_PAGE_SIZE,
    });
  }, [shortageBlogPosts]);

  return (
    <BlogPosts
      title="Blog"
      blogPosts={shortageBlogPosts}
      count={count}
      isLoading={isLoading}
      onShowMore={handleShowMore}
    />
  );
}
