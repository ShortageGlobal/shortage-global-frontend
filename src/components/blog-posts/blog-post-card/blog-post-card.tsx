import styles from './blog-post-card.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { formatDateForHumans, truncateString } from 'core/helpers';
import type { BlogPostPreview } from 'core/api/types';

type BlogPostCardProps = {
  blogPost: BlogPostPreview;
  isVertical?: boolean;
};

export function BlogPostCard({
  blogPost,
  isVertical = false,
}: BlogPostCardProps) {
  return (
    <Link
      href={{
        pathname: '/[organizationSlug]/impact-stories/[blogPostSlug]/',
        query: {
          organizationSlug: blogPost.organization.slug,
          blogPostSlug: blogPost.slug,
        },
      }}
      className={classNames(styles.blogPostCard, {
        [styles.vertical]: isVertical,
      })}
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
        <div className={classNames(styles.title)}>
          {isVertical
            ? truncateString({ value: blogPost.title, maxLength: 50 })
            : blogPost.title}
        </div>

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
