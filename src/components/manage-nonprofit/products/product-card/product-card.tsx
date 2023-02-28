import cardStyles from 'components/card/card.module.scss';
import { useMemo } from 'react';
import { formatPrice } from 'core/helpers';
import { HighDemandBadge } from 'components/high-demand-badge/high-demand-badge';
import { Card } from 'components/card/card';
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

  const details = useMemo(() => {
    return [
      {
        key: 'category',
        value: PRODUCT_CATEGORY_DETAILS[product.category].name,
      },
      {
        key: 'requested',
        value: product.requested_amount,
      },
      {
        key: 'price',
        value: formatPrice(product.price),
      },
    ];
  }, [product]);

  return (
    <Card
      href={productHref}
      image={product.photo}
      imageExtra={
        product.top_priority ? (
          <HighDemandBadge className={cardStyles.imageBadge} />
        ) : null
      }
      title={product.name}
      details={details}
    />
  );
}
