import styles from './card.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import type { LinkProps } from 'next/link';
import type { ImageProps } from 'next/image';

type CardProps = {
  isVertical?: boolean;
  href: LinkProps['href'];
  image?: ImageProps['src'];
  imageExtra?: ReactNode;
  title: string;
  description?: string;
  details: { key: string; value: string }[];
};

export function Card({
  isVertical = false,
  href,
  image = null,
  imageExtra = null,
  title,
  description = null,
  details,
}: CardProps) {
  return (
    <Link
      href={href}
      className={classNames(styles.card, { [styles.vertical]: isVertical })}
    >
      <div className={styles.imageContainer}>
        {image ? (
          <Image src={image} className={styles.image} fill alt="" />
        ) : null}

        {/* custom stuff in the image container, e.g. top priority badge */}
        {imageExtra ? imageExtra : null}
      </div>

      {/* Text content */}
      <div className={styles.textContent}>
        {/* Title */}
        <div className={styles.title}>{title}</div>

        {/* Meta description */}
        {description ? (
          <div className={styles.description}>{description}</div>
        ) : null}
      </div>

      {/* Details */}
      <div className={styles.details}>
        {details.map((detail) => {
          return (
            <div className={styles.detail} key={detail.key}>
              <div className={styles.detailKey}>{detail.key}</div>
              <div className={styles.detailValue}>
                <span>{detail.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Link>
  );
}
