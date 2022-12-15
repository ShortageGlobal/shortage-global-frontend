import styles from './blog-posts.module.scss';
import { Container, Row, Col, Button } from 'react-bootstrap';
import classNames from 'classnames';
import { SectionHeader } from 'components/section-header/section-header';
import { BlogPostCard } from 'components/blog-posts/blog-post-card/blog-post-card';
import type { BlogPostPreview } from 'core/api/types';

type BlogPostsProps = {
  blogPosts: BlogPostPreview[];
  count: number;
  isLoading: boolean;
  onShowMore: () => void;
};

export function BlogPosts({
  blogPosts,
  count,
  isLoading,
  onShowMore,
}: BlogPostsProps) {
  return (
    <div className={styles.blogPosts}>
      {/* Header */}
      <Container>
        <Row>
          <Col>
            <SectionHeader>Impact Stories</SectionHeader>
          </Col>
        </Row>
      </Container>

      {/* BlogPosts List */}
      <Container>
        <Row>
          <Col>
            <div
              className={classNames(styles.blogPostsContainer, {
                [styles.blogPostsContainerLoading]: isLoading,
              })}
            >
              {blogPosts?.map((blogPost) => {
                const key = `${blogPost.organization.slug}-${blogPost.slug}`;
                return (
                  <BlogPostCard
                    key={key}
                    isVertical={true}
                    blogPost={blogPost}
                  />
                );
              })}
            </div>
          </Col>
        </Row>

        {blogPosts?.length < count ? (
          <Row>
            <Col className={styles.showMoreContainer}>
              <Button
                size="lg"
                variant="outline-dark"
                disabled={isLoading}
                onClick={onShowMore}
              >
                Show more
              </Button>
            </Col>
          </Row>
        ) : null}
      </Container>
    </div>
  );
}
