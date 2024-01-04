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
  price: AccountProduct['price'];
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
      {
        key: 'price',
        value: formatPrice(price),
      },
    ];
  }, [quantity, category, requestedAmount, isPublic, price]);

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
