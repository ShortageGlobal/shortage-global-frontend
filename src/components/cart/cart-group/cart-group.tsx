import styles from './cart-group.module.scss';
import { useCallback, type ReactNode } from 'react';
import { useCart, isRequestCancel } from 'core/hooks';
import { DonationOptions } from 'components/cart/donation-options/donation-options';
import { CartItem } from 'components/cart/cart-item/cart-item';
import { formatPrice } from 'core/helpers';
import type {
  Organization,
  Campaign,
  CartItem as CartItemType,
} from 'core/api/types';

type CartGroupProps = {
  title: ReactNode;
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  campaignSlug?: Campaign['slug'];
  campaignUuid?: Campaign['uuid'];
  campaignName?: Campaign['name'];
  items: CartItemType[];
};

export function CartGroup({
  title,
  organizationSlug,
  organizationName,
  campaignSlug,
  campaignUuid,
  campaignName,
  items,
}: CartGroupProps) {
  const { updateCartItemQuantity, deleteFromCart } = useCart();

  const handleItemQuantityChange = useCallback(
    async ({ item, quantity }: { item: CartItemType; quantity: number }) => {
      try {
        await updateCartItemQuantity({ cartItemId: item.uuid, quantity });
      } catch (rejection) {
        if (!isRequestCancel(rejection)) {
          throw rejection;
        }
      }
    },
    [updateCartItemQuantity]
  );

  const handleItemRemove = useCallback(
    ({ item }: { item: CartItemType }) => {
      deleteFromCart({ cartItemId: item.uuid });
    },
    [deleteFromCart]
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  return (
    <div className={styles.cartGroup}>
      {/* Title */}
      <p>
        <span className={styles.cartGroupTitle}>{title}</span>
      </p>

      {/* Cart Items */}
      <div className={styles.cartItemsList}>
        {items.map((item) => {
          return (
            <CartItem
              key={item.uuid}
              item={item}
              onQuantityChange={handleItemQuantityChange}
              onRemove={handleItemRemove}
            />
          );
        })}
      </div>

      {/* Summary */}
      <dl className={styles.summaryLine}>
        <dt className={styles.summaryLabel}>Total donation</dt>
        <dd className={styles.summaryValue}>{formatPrice(totalPrice)}</dd>
      </dl>

      {/* Donation Options */}
      <DonationOptions
        organizationSlug={organizationSlug}
        organizationName={organizationName}
        campaignSlug={campaignSlug}
        campaignUuid={campaignUuid}
        campaignName={campaignName}
        items={items}
      />
    </div>
  );
}
