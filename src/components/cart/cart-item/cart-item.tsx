import styles from './cart-item.module.scss';
import { useMemo, useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Button, Form } from 'react-bootstrap';
import { Trash2 } from 'react-feather';
import Link from 'next/link';
import Image from 'next/image';
import type { ChangeEvent } from 'react';
import type { CartItem } from 'app/api/types';

type CartItemProps = {
  item: CartItem;
  onQuantityChange: ({
    item,
    quantity,
  }: {
    item: CartItem;
    quantity: number;
  }) => void;
  onRemove: ({ item }: { item: CartItem }) => void;
  isRemoveDisabled?: boolean;
};

export function CartItem({
  item,
  onQuantityChange,
  onRemove,
  isRemoveDisabled = false,
}: CartItemProps) {
  const [displayQuantity, setDisplayQuantity] = useState<number | string>(
    () => item.quantity
  );

  // change display quantity value if it changes from outside
  useEffect(() => {
    setDisplayQuantity(item.quantity);
  }, [item.quantity]);

  const productPageHref = useMemo(() => {
    return {
      pathname: '/organizations/[organizationSlug]/products/[productSlug]',
      query: {
        organizationSlug: item.product.organization.slug,
        productSlug: item.product.slug,
      },
    };
  }, [item]);

  const handleQuantityChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // set to local state
      setDisplayQuantity(value);

      // if valid, set in store
      const quantity = Number(value);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return;
      }
      onQuantityChange({ item, quantity });
    },
    [item, onQuantityChange]
  );

  const handleQuantityBlur = useCallback(() => {
    setDisplayQuantity(item.quantity);
  }, [item, onQuantityChange]);

  const handleRemove = useCallback(() => {
    onRemove({ item });
  }, [item, onRemove]);

  return (
    <div className={styles.cartItem}>
      <div className={styles.photo}>
        <Link href={productPageHref}>
          <a aria-label="Visit product page" className={styles.photoLink}>
            {item.product.photo ? (
              <Image
                src={item.product.photo}
                alt={item.product.name}
                layout="fill"
                objectFit="contain"
              />
            ) : null}
          </a>
        </Link>
      </div>

      <div className={classNames(styles.name, 'text-truncate')}>
        <Link href={productPageHref}>
          <a className={styles.nameLink}>{item.product.name}</a>
        </Link>
      </div>

      <Form.Group
        controlId={`quantity-${item.uuid}`}
        className={styles.quantity}
      >
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="number"
          step={1}
          min={1}
          placeholder="Quantity"
          value={displayQuantity}
          onChange={handleQuantityChange}
          onBlur={handleQuantityBlur}
          required
        />
      </Form.Group>

      <div className={styles.remove}>
        <Button
          variant="outline-dark"
          className={styles.removeButton}
          onClick={handleRemove}
          disabled={isRemoveDisabled}
        >
          <Trash2 size="1rem" />
          <span className={styles.removeButtonLabel}>Remove</span>
        </Button>
      </div>
    </div>
  );
}
