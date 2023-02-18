import styles from './product-card.module.scss';
import { useMemo } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from 'core/helpers';
import { HighDemandBadge } from 'components/high-demand-badge/high-demand-badge';
import { PRODUCT_CATEGORY_DETAILS } from 'core/category-details';
import type { AccountOrganization, AccountProduct } from 'core/api/types';

type ProductCardProps = {
  product: AccountProduct;
  organization: AccountOrganization;
};

export function ProductCard({ product, organization }: ProductCardProps) {
  const productHref = useMemo(() => {
    return {
      pathname:
        '/private/manage-nonprofit/[organizationSlug]/requested-goods/[productId]/',
      query: {
        organizationSlug: organization.slug,
        productId: product.id,
      },
    };
  }, [product, organization]);

  return (
    <Link href={productHref} className={styles.productCard}>
      <div className={styles.photoContainer}>
        {product.photo ? (
          <Image src={product.photo} className={styles.photo} fill alt="" />
        ) : null}

        {/* top priority */}
        {product.top_priority ? (
          <HighDemandBadge className={styles.highDemandBadge} />
        ) : null}
      </div>

      {/* Name */}
      <div className={classNames(styles.name, 'text-truncate')}>
        {product.name}
      </div>

      {/* Details */}
      <div className={styles.details}>
        {/* Category */}
        <div className={styles.detail}>
          <div className={styles.title}>category</div>
          <div className={classNames(styles.value, styles.categoryValue)}>
            <span>{PRODUCT_CATEGORY_DETAILS[product.category].name}</span>
          </div>
        </div>

        {/* Requested Amount */}
        <div className={styles.detail}>
          <div className={styles.title}>requested</div>
          <div className={styles.value}>{product.requested_amount}</div>
        </div>

        {/* Price */}
        <div className={styles.detail}>
          <div className={styles.title}>price</div>
          <div className={styles.value}>{formatPrice(product.price)}</div>
        </div>
      </div>
    </Link>
  );
}
