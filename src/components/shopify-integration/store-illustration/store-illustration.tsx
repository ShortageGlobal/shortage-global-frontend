import styles from './store-illustration.module.scss';
import { Minus, Plus, ShoppingBag } from 'react-feather';
import Image from 'next/image';
import classNames from 'classnames';

export function StoreIllustration() {
  return (
    <div className={styles.storeIllustration} data-nosnippet tabIndex={0}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <ShoppingBag className={styles.logo} />
          <span className={styles.brandName}>My Store</span>
        </div>
        <div className={styles.navigation}>
          <div>Home</div>
          <div>Catalog</div>
          <div>Contact</div>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.productImageContainer}>
          <Image
            className={styles.productImage}
            alt=""
            src="/images/shopify-integration/towels.jpg"
            fill
          />
        </div>

        <div className={styles.productDetails}>
          <div className={styles.title}>
            Towels 5 Pack Bath Towels Set, Lint Free, 100% Cotton
          </div>

          <div className={styles.price}>$42.00</div>

          <div className={styles.quantity}>
            <div className={styles.quantityLabel}>Quantity</div>
            <div className={styles.quantityInput}>
              <Minus size="0.75em" />
              <span>1</span>
              <Plus size="0.75em" />
            </div>
          </div>

          <div className={classNames(styles.button, styles.addToCartButton)}>
            Add to Cart
          </div>

          <div
            className={classNames(
              styles.button,
              styles.donateButton,
              styles.glow
            )}
          >
            Donate Item
          </div>
        </div>
      </div>

      <div className={styles.explanation}>
        <p>
          Let shoppers to <span className={styles.highlight}>donate</span> to{' '}
          important causes with <span className={styles.highlight}>items</span>{' '}
          from <span className={styles.highlight}>your store</span>
        </p>
      </div>
    </div>
  );
}
