import cardStyles from 'components/card/card.module.scss';
import { useMemo } from 'react';
import { Badge } from 'react-bootstrap';
import { Card } from 'components/card/card';
import { formatDateForHumans } from 'core/helpers';
import type { BlogPostPreview, ShortageBlogPostPreview } from 'core/api/types';

type BlogPostCardProps = {
  blogPost: BlogPostPreview | ShortageBlogPostPreview;
  isVertical?: boolean;
};

export function BlogPostCard({
  blogPost,
  isVertical = false,
}: BlogPostCardProps) {
  const blogPostHref = useMemo(() => {
    if ('organization' in blogPost) {
      return {
        pathname: '/[organizationSlug]/impact-stories/[blogPostSlug]/',
        query: {
          organizationSlug: blogPost.organization.slug,
          blogPostSlug: blogPost.slug,
        },
      };
    } else {
      return {
        pathname: '/blog/[blogPostSlug]/',
        query: {
          blogPostSlug: blogPost.slug,
        },
      };
    }
  }, [blogPost]);

  const details = useMemo(() => {
    return [
      {
        key: 'updated on',
        value: formatDateForHumans({
          date: blogPost.updated_at,
        }),
      },
    ];
  }, [blogPost]);

  return (
    <Card
      isVertical={isVertical}
      href={blogPostHref}
      image={blogPost.image}
      imageExtra={
        blogPost.is_draft ? (
          <Badge className={cardStyles.imageBadge} bg="secondary">
            Draft
          </Badge>
        ) : null
      }
      title={blogPost.title}
      details={details}
    />
  );
}
