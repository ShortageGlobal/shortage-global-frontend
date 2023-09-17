import styles from './product-details.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useCallback } from 'react';
import Link from 'next/link';
import { ShoppingCart, Loader } from 'react-feather';
import { Row, Col, Button, Placeholder, Alert } from 'react-bootstrap';
import { formatPrice, pluralize } from 'core/helpers';
import { useCart } from 'core/hooks';
import { HighDemandBadge } from 'components/high-demand-badge/high-demand-badge';
import { ProceedToDonationButton } from 'components/proceed-to-donation-button/proceed-to-donation-button';
import type { Product } from 'core/api/types';

type ProductDetailsProps = {
  product: Product;
  isProductInCart: boolean;
  isProductBeingAddedToCart: boolean;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
};

export function ProductDetails({
  product,
  isProductInCart,
  isProductBeingAddedToCart,
  onAddToCart,
  onRemoveFromCart,
}: ProductDetailsProps) {
  const { isCartReady, setIsCartSidebarShown } = useCart();

  const handleShowCartSidebar = useCallback(() => {
    setIsCartSidebarShown(true);
  }, []);

  return (
    <>
      <Row>
        {/* Photo */}
        {product.photo ? (
          <Col md={6} className={styles.photoContainer}>
            <img
              alt="CampaignProduct image"
              src={product.photo}
              className={styles.photo}
            />
          </Col>
        ) : null}

        {/* Details */}
        <Col md={6} className={styles.details}>
          {/* Name */}
          <h2 className={styles.name}>{product.name}</h2>

          {/* High demand badge */}
          {product.top_priority ? <HighDemandBadge /> : null}

          {/* Price */}
          {product.price !== null ? (
            <div>
              <div>
                <span className={styles.price}>
                  {formatPrice(product.price)}
                </span>{' '}
                <span>retail price</span>
              </div>
              <div>
                <span className="text-muted">
                  including delivery, taxes, and administration fee
                </span>
              </div>
            </div>
          ) : null}

          {/* Requested amount */}
          <div>
            <div className={styles.requestedAmount}>
              {product.requested_amount}{' '}
              {pluralize(product.requested_amount, 'item', 'items')}
            </div>
            <div className="break-word">
              requested by{' '}
              <Link
                href={{
                  pathname: '/[organizationSlug]/',
                  query: { organizationSlug: product.organization.slug },
                }}
              >
                {product.organization.name}
              </Link>
            </div>
          </div>

          {/* Campaign */}
          {product.campaign ? (
            <Alert variant="info">
              The donation will be made to the &quot;
              <Link
                className="break-word"
                href={{
                  pathname:
                    '/[organizationSlug]/campaigns/[campaignSlug]/[campaignUuid]/',
                  query: {
                    organizationSlug: product.organization.slug,
                    campaignSlug: product.campaign.slug,
                    campaignUuid: product.campaign.uuid,
                  },
                }}
              >
                {product.campaign.name}
              </Link>
              &quot; campaign.
            </Alert>
          ) : null}

          <div className={styles.orderSection}>
            <h5>
              Order and deliver in a few clicks to the{' '}
              {product.organization.name}&apos;s warehouse
            </h5>

            {/* Placeholder */}
            {!isCartReady ? (
              <Placeholder as="div" animation="glow">
                <Placeholder.Button
                  size="lg"
                  aria-hidden="true"
                  className={styles.primaryActionBtnPlaceholder}
                />
              </Placeholder>
            ) : null}

            {/* Add to cart button */}
            {!isProductInCart && isCartReady ? (
              <Button
                size="lg"
                disabled={isProductBeingAddedToCart}
                className={styles.primaryActionBtn}
                onClick={onAddToCart}
              >
                {isProductBeingAddedToCart ? (
                  <Loader
                    role="status"
                    aria-hidden="true"
                    className={animationStyles.rotate}
                  />
                ) : (
                  <ShoppingCart />
                )}
                <span>Add to cart</span>
              </Button>
            ) : null}

            {/* Proceed to donate button */}
            {isProductInCart && isCartReady ? (
              <>
                <div>
                  Already in{' '}
                  <span
                    role="button"
                    onClick={handleShowCartSidebar}
                    className={styles.inlineTextButton}
                  >
                    cart
                  </span>
                </div>

                <ProceedToDonationButton className={styles.primaryActionBtn} />

                <p>
                  or{' '}
                  <span
                    role="button"
                    onClick={onRemoveFromCart}
                    className={styles.inlineTextButton}
                  >
                    remove
                  </span>
                </p>
              </>
            ) : null}
          </div>
        </Col>
      </Row>

      <Row>
        {/* Minimal Requirements (Description) */}
        <Col
          xl={{ span: 8, offset: 2 }}
          className={styles.descriptionContainer}
        >
          <h4>Minimal Requirements</h4>

          {product.description ? (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <div className={styles.description}>
              <p>No requirements are provided for this product.</p>
            </div>
          )}
        </Col>
      </Row>
    </>
  );
}
