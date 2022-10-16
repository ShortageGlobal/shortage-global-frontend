import styles from './cart-item-placeholder.module.scss';
import { Placeholder } from 'react-bootstrap';

export function CartItemPlaceholder() {
  return (
    <Placeholder
      as="div"
      animation="glow"
      className={styles.cartItemPlaceholder}
    >
      <div className={styles.photo}>
        <Placeholder />
      </div>

      <div className={styles.name}>
        <Placeholder size="lg" />
      </div>

      <div className={styles.quantity}>
        <Placeholder size="lg" className={styles.quantityLabel} />
        <Placeholder className={styles.quantityInput} />
      </div>

      <div className={styles.remove}>
        <Placeholder className={styles.removeButton} />
      </div>
    </Placeholder>
  );
}
