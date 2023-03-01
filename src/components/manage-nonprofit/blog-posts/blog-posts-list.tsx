import commonStyles from 'styles/pages/private/common.module.scss';
import { useEffect, useState } from 'react';
import { Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import classNames from 'classnames';
import { Search } from 'react-feather';
import {
  useAppSelector,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import { useDebouncedCallback } from 'use-debounce';
import { fetchAccountBlogPosts } from 'core/api';
import { Pagination } from 'components/pagination/pagination';
import { LoadingMessage } from 'components/loading-message/loading-message';
import { BlogPostCard } from 'components/manage-nonprofit/blog-posts/blog-post-card/blog-post-card';
import { DEFAULT_PAGE_SIZE } from 'core/constants';
import type { AccountOrganization, AccountBlogPost } from 'core/api/types';

export function BlogPostsList() {
  const { showNotification } = useNotifications();
  const { organization } = useAppSelector(selectAccountOrganization);

  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalCount, setTotalCount] = useState(null);
  const [blogPosts, setBlogPosts] = useState<AccountBlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getFetchBlogPostsCancelToken = useCancelToken();

  const debouncedFetchBlogPosts = useDebouncedCallback(
    async ({
      organizationSlug,
      search,
      offset,
      limit,
    }: {
      organizationSlug: AccountOrganization['slug'];
      search: string;
      offset?: number;
      limit?: number;
    }) => {
      const cancelToken = getFetchBlogPostsCancelToken();

      setIsLoading(true);

      try {
        const response = await fetchAccountBlogPosts({
          organizationSlug,
          search,
          offset,
          limit,
          cancelToken,
        });

        setBlogPosts(response.data.results);
        setTotalCount(response.data.count);
        setIsLoading(false);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        const rejectionErrors = rejection?.response?.data;
        showNotification({
          isFailure: true,
          message: rejectionErrors?.details || 'Failed to get Impact Stories',
        });
        setIsLoading(false);
      }
    },
    250
  );

  useEffect(() => {
    debouncedFetchBlogPosts({
      organizationSlug: organization.slug,
      search: searchQuery,
      offset: pageSize * pageNumber,
      limit: pageSize,
    });

    return () => {
      debouncedFetchBlogPosts.cancel();
    };
  }, [organization.slug, searchQuery, pageSize, pageNumber]);

  return (
    <div>
      <Row className={commonStyles.listControls}>
        <Col>
          <InputGroup>
            <InputGroup.Text as="label" htmlFor="search-input">
              <Search />
            </InputGroup.Text>
            <Form.Control
              id="search-input"
              className={commonStyles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col className={commonStyles.paginationCol}>
          {blogPosts?.length > 0 ? (
            <Pagination
              pageSize={pageSize}
              pageNumber={pageNumber}
              totalCount={totalCount}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              onPageNumberChange={(newPageNumber) =>
                setPageNumber(newPageNumber)
              }
            />
          ) : null}
        </Col>
      </Row>

      {/* Loading */}
      {!blogPosts?.length && isLoading ? <LoadingMessage /> : null}

      {/* No blog posts */}
      {blogPosts?.length === 0 && !isLoading ? (
        <div>
          <p>No Impact Stories found.</p>
          {searchQuery?.length > 0 ? (
            <Button variant="outline-dark" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          ) : null}
        </div>
      ) : null}

      {/* Blog posts list */}
      {blogPosts?.length > 0 ? (
        <div
          className={classNames(commonStyles.list, {
            [commonStyles.loading]: isLoading,
          })}
        >
          {blogPosts.map((blogPost) => {
            return (
              <BlogPostCard
                key={blogPost.uuid}
                blogPost={blogPost}
                organization={organization}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
