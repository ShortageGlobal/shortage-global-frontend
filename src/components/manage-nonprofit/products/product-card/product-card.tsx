import cardStyles from 'components/card/card.module.scss';
import { useMemo } from 'react';
import { formatPrice } from 'core/helpers';
import { HighDemandBadge } from 'components/high-demand-badge/high-demand-badge';
import { Card } from 'components/card/card';
import { PRODUCT_CATEGORY_DETAILS } from 'core/category-details';
import type { AccountOrganization, AccountProduct } from 'core/api/types';

type ProductCardProps = {
  className?: string;
  quantity?: number;
  id: AccountProduct['id'];
  name: AccountProduct['name'];
  category: AccountProduct['category'];
  photo: AccountProduct['photo'];
  price?: AccountProduct['base_price']; // used for package items
  basePrice?: AccountProduct['base_price'];
  requestedAmount?: AccountProduct['requested_amount'];
  isPublic?: AccountProduct['is_public'];
  topPriority?: AccountProduct['top_priority'];
  organization: AccountOrganization;
};

export function ProductCard({
  className,
  quantity,
  id,
  name,
  category,
  photo,
  price,
  basePrice,
  requestedAmount,
  isPublic,
  topPriority,
  organization,
}: ProductCardProps) {
  const productHref = useMemo(() => {
    return {
      pathname:
        '/private/manage-nonprofit/[organizationSlug]/requested-goods/[productId]/',
      query: {
        organizationSlug: organization.slug,
        productId: id,
      },
    };
  }, [id, organization]);

  const details = useMemo(() => {
    return [
      ...(quantity ? [{ key: 'quantity', value: quantity }] : []),
      {
        key: 'category',
        value: PRODUCT_CATEGORY_DETAILS[category].name,
      },
      ...(typeof requestedAmount === 'number'
        ? [
            {
              key: 'requested',
              value: requestedAmount,
            },
          ]
        : []),
      ...(typeof isPublic === 'boolean'
        ? [
            {
              key: 'public',
              value: isPublic ? 'yes' : 'no',
            },
          ]
        : []),
      ...(typeof price !== 'undefined'
        ? [
            {
              key: 'price',
              value: formatPrice(price),
            },
          ]
        : []),
      ...(typeof basePrice !== 'undefined'
        ? [
            {
              key: 'base price',
              value: formatPrice(basePrice),
            },
          ]
        : []),
    ];
  }, [quantity, category, requestedAmount, isPublic, price, basePrice]);

  return (
    <Card
      className={className}
      href={productHref}
      image={photo}
      imageExtra={
        topPriority ? (
          <HighDemandBadge className={cardStyles.imageBadge} />
        ) : null
      }
      title={name}
      details={details}
    />
  );
}
