import styles from './blog-post-card.module.scss';
import { useMemo } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { formatDateForHumans } from 'core/helpers';
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

  return (
    <Link href={blogPostHref} className={styles.blogPostCard}>
      <div className={styles.imageContainer}>
        {blogPost.image ? (
          <Image src={blogPost.image} className={styles.image} fill alt="" />
        ) : null}
      </div>

      {/* Text content */}
      <div className={styles.textContent}>
        {/* Title */}
        <div className={classNames(styles.title, 'text-truncate')}>
          {blogPost.title}
        </div>

        {/* Meta description */}
        <div className={styles.description}>{blogPost.meta_description}</div>
      </div>

      {/* Details */}
      <div className={styles.details}>
        {/* Updated on */}
        <div className={styles.detail}>
          <div className={styles.detailKey}>updated on</div>
          <div className={styles.detailValue}>
            {formatDateForHumans({
              date: blogPost.updated_at,
              isMonthShort: true,
            })}
          </div>
        </div>

        {/* Published */}
        <div className={styles.detail}>
          <div className={styles.detailKey}>published</div>
          <div className={styles.detailValue}>
            {blogPost.is_draft ? 'no' : 'yes'}
          </div>
        </div>
      </div>
    </Link>
  );
}
