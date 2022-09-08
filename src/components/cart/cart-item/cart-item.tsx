import styles from './cart-item.module.scss';
import { useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Form } from 'react-bootstrap';
import { Trash2 } from 'react-feather';
import type { CartItem } from 'app/api/types';
import classNames from 'classnames';

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
};

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
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
    (e) => {
      const quantity = Number(e.target.value);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return;
      }
      onQuantityChange({ item, quantity });
    },
    [item, onQuantityChange]
  );

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
          placeholder="42"
          value={item.quantity}
          onChange={handleQuantityChange}
        />
      </Form.Group>

      <div className={styles.remove}>
        <Button
          variant="outline-dark"
          className={styles.removeButton}
          onClick={handleRemove}
        >
          <span>Remove</span>
          <Trash2 size="1rem" />
        </Button>
      </div>
    </div>
  );
}
