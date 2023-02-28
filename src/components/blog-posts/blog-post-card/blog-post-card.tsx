import { useMemo } from 'react';
import { Card } from 'components/card/card';
import { formatDateForHumans } from 'core/helpers';
import type { BlogPostPreview } from 'core/api/types';

type BlogPostCardProps = {
  blogPost: BlogPostPreview;
  isVertical?: boolean;
};

export function BlogPostCard({
  blogPost,
  isVertical = false,
}: BlogPostCardProps) {
  const blogPostHref = useMemo(() => {
    return {
      pathname: '/[organizationSlug]/impact-stories/[blogPostSlug]/',
      query: {
        organizationSlug: blogPost.organization.slug,
        blogPostSlug: blogPost.slug,
      },
    };
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
      title={blogPost.title}
      details={details}
    />
  );
}
