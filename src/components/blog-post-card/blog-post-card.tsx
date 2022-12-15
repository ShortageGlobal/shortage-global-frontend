import styles from './blog-post-card.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import { formatDateForHumans } from 'core/helpers';
import type { BlogPostPreview } from 'core/api/types';

type BlogPostCardProps = {
  blogPost: BlogPostPreview;
};

export function BlogPostCard({ blogPost }: BlogPostCardProps) {
  return (
    <Link
      href={{
        pathname:
          '/organizations/[organizationSlug]/impact-stories/[blogPostSlug]',
        query: {
          organizationSlug: blogPost.organization.slug,
          blogPostSlug: blogPost.slug,
        },
      }}
      className={styles.blogPostCard}
    >
      {/* photo */}
      {blogPost.image ? (
        <div className={styles.imageWrap}>
          <Image
            src={blogPost.image}
            alt={blogPost.title}
            className={styles.image}
            fill
          />
        </div>
      ) : null}

      <div className={styles.content}>
        <div className={classNames(styles.title)}>{blogPost.title}</div>

        <div className={styles.text}>
          <div className={styles.detailKey}>updated on</div>
          <div className={styles.detailValue}>
            {formatDateForHumans({ date: blogPost.updated_at })}
          </div>
        </div>
      </div>
    </Link>
  );
}
