import styles from './product-card.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from 'react-bootstrap';
import classNames from 'classnames';
import { HighDemandBadge } from 'components/high-demand-badge/high-demand-badge';
import { formatPrice } from 'core/helpers';
import type { ProductPreview, Slug } from 'core/api/types';

type ProductCardProps = {
  product: ProductPreview;
  organizationSlug?: Slug;
  organizationName?: string;
};

export function ProductCard({
  product,
  organizationSlug,
  organizationName,
}: ProductCardProps) {
  return (
    <Card className={styles.productCard}>
      {/* 
        Link cannot contain another link, so we have this workaround
        See: https://stackoverflow.com/a/46707009/1065780 
      */}
      <Link
        href={{
          pathname: '/organizations/[organizationSlug]/products/[productSlug]',
          query: { organizationSlug, productSlug: product.slug },
        }}
        className={styles.productLinkOverlay}
        aria-label="Visit product page"
      ></Link>

      <div className={styles.cardImage}>
        {/* photo */}
        {product.photo ? (
          <Image
            src={product.photo}
            alt={product.name}
            fill
            className={styles.photo}
          />
        ) : null}

        {/* top priority */}
        {product.top_priority ? (
          <HighDemandBadge className={styles.highDemandBadge} />
        ) : null}
      </div>

      <Card.Body className={styles.cardBody}>
        <Card.Title className={classNames(styles.cardTitle, 'text-truncate')}>
          {product.name}
        </Card.Title>

        <Card.Text as="div" className={styles.cardText}>
          {/* price */}
          <div className={classNames(styles.price, 'text-truncate')}>
            {product.price === null ? (
              <i>Price is not set</i>
            ) : (
              formatPrice(product.price)
            )}
          </div>

          {/* requested amount */}
          <div className={classNames(styles.requestedAmount, 'text-truncate')}>
            {product.requested_amount} items requested
          </div>

          {/* organization */}
          {organizationSlug && organizationName ? (
            <div className="text-truncate">
              by{' '}
              <Link
                href={{
                  pathname: '/organizations/[organizationSlug]',
                  query: { organizationSlug },
                }}
                className={styles.organizationLink}
              >
                {organizationName}
              </Link>
            </div>
          ) : null}
        </Card.Text>

        {/* Check details "button" */}
        <span
          className={classNames(
            'btn',
            'btn-primary',
            styles.checkDetailsButton
          )}
        >
          Check details
        </span>
      </Card.Body>
    </Card>
  );
}
