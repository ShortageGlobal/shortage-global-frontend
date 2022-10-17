import styles from 'styles/pages/product.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ShoppingCart, Loader } from 'react-feather';
import { Container, Row, Col, Button, Placeholder } from 'react-bootstrap';
import { formatPrice } from 'app/helpers';
import { isRequestCancel, useAppSelector, useCart } from 'app/hooks';
import { wrapper } from 'app/store';
import { fetchProduct } from 'app/store/slices/product';
import { selectProduct } from 'app/store/slices/product';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
  getProductCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { HighDemandBadge } from 'components/high-demand-badge/high-demand-badge';
import { ProceedToDonationButton } from 'components/proceed-to-donation-button/proceed-to-donation-button';
import type { NextPageWithLayout } from 'pages/_app';

const ProductPage: NextPageWithLayout = () => {
  const { product } = useAppSelector(selectProduct);

  const {
    isCartReady,
    setIsCartSidebarShown,
    getCartItem,
    addToCart,
    deleteFromCart,
  } = useCart();

  const [isProductBeingAddedToCart, setIsProductBeingAddedToCart] =
    useState(false);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getOrganizationCrumb({
        organizationSlug: product.organization.slug,
        organizationName: product.organization.name,
      }),
      getProductCrumb({
        organizationSlug: product.organization.slug,
        productSlug: product.slug,
        productName: product.name,
        isActive: true,
      }),
    ];
  }, [product]);

  const cartItem = useMemo(() => {
    return getCartItem({
      productSlug: product.slug,
      organizationSlug: product.organization.slug,
    });
  }, [getCartItem, product]);

  const isProductInCart = useMemo(() => {
    return !!cartItem;
  }, [cartItem]);

  const handleShowCartSidebar = useCallback(() => {
    setIsCartSidebarShown(true);
  }, []);

  const handleAddProduct = useCallback(async () => {
    setIsProductBeingAddedToCart(true);
    try {
      await addToCart({
        product_slug: product.slug,
        organization_slug: product.organization.slug,
        quantity: 1,
      });
      setIsProductBeingAddedToCart(false);
    } catch (rejection) {
      if (isRequestCancel(rejection)) {
        return;
      }
      setIsProductBeingAddedToCart(false);
    }
  }, [product, addToCart]);

  const handleRemoveProduct = useCallback(() => {
    deleteFromCart({
      cartItemId: cartItem.uuid,
    });
  }, [cartItem, deleteFromCart]);

  return (
    <>
      <Head>
        <title>{product.name} | Shortage</title>
      </Head>

      <Container className={styles.product}>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
        <Row>
          {/* Photo */}
          {product.photo ? (
            <Col md={6} className={styles.photoContainer}>
              <img
                alt="Product image"
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
                    including all commissions and fees
                  </span>
                </div>
              </div>
            ) : null}

            {/* Requested amount */}
            <div>
              <div className={styles.requestedAmount}>
                {product.requested_amount} items
              </div>
              <div className="text-truncate">
                requested by{' '}
                <Link
                  href={{
                    pathname: '/organizations/[organizationSlug]',
                    query: { organizationSlug: product.organization.slug },
                  }}
                >
                  <a>{product.organization.name}</a>
                </Link>
              </div>
            </div>

            <div className={styles.orderSection}>
              <h5>Order and deliver in a few clicks</h5>

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
                  onClick={handleAddProduct}
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

                  <ProceedToDonationButton
                    className={styles.primaryActionBtn}
                  />

                  <p>
                    or{' '}
                    <span
                      role="button"
                      onClick={handleRemoveProduct}
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
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const organizationSlug = context.params.organizationSlug as string;
    const productSlug = context.params.productSlug as string;

    await store.dispatch(fetchProduct({ organizationSlug, productSlug }));

    const { product } = store.getState();

    if (product.error?.status === 404) {
      return {
        notFound: true,
      };
    }

    return {
      props: {},
    };
  }
);

export default ProductPage;
