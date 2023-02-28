import { useMemo } from 'react';
import { formatDateForHumans } from 'core/helpers';
import { Card } from 'components/card/card';
import type { AccountOrganization, AccountBlogPost } from 'core/api/types';

type BlogPostCardProps = {
  blogPost: AccountBlogPost;
  organization: AccountOrganization;
};

export function BlogPostCard({ blogPost, organization }: BlogPostCardProps) {
  const blogPostHref = useMemo(() => {
    return {
      pathname:
        '/private/manage-nonprofit/[organizationSlug]/impact-stories/[blogPostUuid]/',
      query: {
        organizationSlug: organization.slug,
        blogPostUuid: blogPost.uuid,
      },
    };
  }, [blogPost, organization]);

  const details = useMemo(() => {
    return [
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
  }, [blogPost]);

  return (
    <Card
      href={blogPostHref}
      image={blogPost.image}
      title={blogPost.title}
      description={blogPost.meta_description}
      details={details}
    />
  );
}
