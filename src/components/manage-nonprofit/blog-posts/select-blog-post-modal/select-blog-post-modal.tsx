import styles from './select-blog-post-modal.module.scss';
import { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Modal, InputGroup, Form, Button } from 'react-bootstrap';
import { Search, Plus } from 'react-feather';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import { fetchAccountBlogPosts } from 'core/api';
import { formatDateForHumans } from 'core/helpers';
import { LoadingMessage } from 'components/loading-message/loading-message';
import { Card } from 'components/card/card';
import type { AccountOrganization, AccountBlogPost } from 'core/api/types';

type SelectBlogPostModalProps = {
  organization: AccountOrganization;
  show: boolean;
  onHide: () => void;
  onSelect: (blogPostUuid: AccountBlogPost['uuid']) => void;
};

export function SelectBlogPostModal({
  organization,
  show,
  onHide,
  onSelect,
}: SelectBlogPostModalProps) {
  const { showNotification } = useNotifications();

  const [isLoading, setIsLoading] = useState(true);
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
    if (!show) {
      return;
    }
    debouncedFetchBlogPosts({
      organizationSlug: organization.slug,
      search: searchQuery,
      offset: 0,
      limit: 5,
    });

    return () => {
      debouncedFetchBlogPosts.cancel();
    };
  }, [organization.slug, searchQuery, show]);

  const handleSelect = useCallback(
    (blogPost: AccountBlogPost) => {
      onSelect(blogPost.uuid);
    },
    [onSelect]
  );

  const handleResetOnExit = useCallback(() => {
    setSearchQuery('');
    setIsLoading(true);
    setBlogPosts([]);
  }, []);

  return (
    <Modal
      scrollable
      size="lg"
      show={show}
      onHide={onHide}
      onExited={handleResetOnExit}
      className={styles.modal}
      aria-labelledby="select-blog-post-modal-title"
    >
      <Modal.Header closeButton className={styles.header}>
        <div className={styles.headerContent}>
          <Modal.Title id="select-blog-post-modal-title">
            Select Impact Story
          </Modal.Title>

          <Form className={styles.searchContainer}>
            <InputGroup>
              <InputGroup.Text
                as="label"
                htmlFor="search-select-blog-post-input"
              >
                <Search />
              </InputGroup.Text>
              <Form.Control
                id="search-select-blog-post-input"
                placeholder="Search"
                autoFocus
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Form>
        </div>
      </Modal.Header>

      <Modal.Body className={styles.body}>
        <div className={styles.content}>
          {/* Loading */}
          {!blogPosts?.length && isLoading ? <LoadingMessage /> : null}

          {/* No blog posts */}
          {blogPosts?.length === 0 && !isLoading ? (
            <>
              <p>No Impact Stories found.</p>

              {searchQuery?.length > 0 ? (
                <Button
                  variant="outline-dark"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              ) : null}
            </>
          ) : null}

          {blogPosts?.length > 0 ? (
            <div
              className={classNames(styles.list, {
                [styles.loading]: isLoading,
              })}
            >
              {blogPosts.map((blogPost) => {
                const details = [
                  {
                    key: 'updated on',
                    value: formatDateForHumans({
                      date: blogPost.updated_at,
                      isMonthShort: true,
                    }),
                  },
                  {
                    key: 'published',
                    value: blogPost.is_draft ? 'no' : 'yes',
                  },
                ];
                return (
                  <Card
                    key={blogPost.uuid}
                    onClick={() => handleSelect(blogPost)}
                    image={blogPost.image}
                    title={blogPost.title}
                    description={blogPost.meta_description}
                    details={details}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Link
          href={{
            pathname:
              '/private/manage-nonprofit/[organizationSlug]/impact-stories/create',
            query: {
              organizationSlug: organization.slug,
            },
          }}
          passHref
          legacyBehavior
        >
          <Button variant="outline-dark">
            <Plus />
            <span>Add Impact Story</span>
          </Button>
        </Link>

        <Button onClick={onHide} variant="outline-dark">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
