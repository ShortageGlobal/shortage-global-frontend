import { useState, useMemo, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';
import * as gtm from 'core/tracking/gtm';
import { extractAccessTokenFromSession } from 'core/helpers';
import { isRequestCancel, useAppSelector, useCart } from 'core/hooks';
import { wrapper } from 'core/store';
import { getProductId } from 'core/helpers';
import { fetchOrganization } from 'core/store/slices/organization';
import { fetchProduct } from 'core/store/slices/product';
import { selectProduct } from 'core/store/slices/product';
import { DraftWarning } from 'components/draft-warning/draft-warning';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
  getProductCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { ProductDetails } from 'components/products/product-details/product-details';
import { ROOT_URL, PRODUCT_CATEGORY_LABELS } from 'core/constants';
import type { NextPageWithLayout } from 'pages/_app';
import type { Product } from 'core/api/types';

const ProductPage: NextPageWithLayout = () => {
  const { product } = useAppSelector(selectProduct);

  const { getCartItem, addToCart, deleteFromCart } = useCart();

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

  // track page view
  useEffect(() => {
    gtm.trackProductView({
      organizationSlug: product.organization.slug,
      organizationName: product.organization.name,
      productSlug: product.slug,
      productPrice: product.price,
      productName: product.name,
    });
  }, [
    product?.organization.slug,
    product?.organization.name,
    product?.slug,
    product?.price,
    product?.name,
  ]);

  const cartItem = useMemo(() => {
    return getCartItem({
      productSlug: product.slug,
      organizationSlug: product.organization.slug,
    });
  }, [getCartItem, product]);

  const isProductInCart = useMemo(() => {
    return !!cartItem;
  }, [cartItem]);

  const handleAddProductToCart = useCallback(async () => {
    setIsProductBeingAddedToCart(true);
    try {
      await addToCart({
        organization_slug: product.organization.slug,
        organization_name: product.organization.name,
        product_slug: product.slug,
        product_price: product.price,
        product_name: product.name,
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

  const handleRemoveProductFromCart = useCallback(() => {
    deleteFromCart({
      cartItemId: cartItem.uuid,
    });
  }, [cartItem, deleteFromCart]);

  return (
    <>
      <Head>
        <title>{`${product.name} | Shortage`}</title>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addProductJsonLd(product)}
          key="product-jsonld"
        />
      </Head>

      {product.organization.is_draft || !product.organization.is_verified ? (
        <DraftWarning
          adminHref={{
            pathname:
              '/private/manage-nonprofit/[organizationSlug]/requested-goods/[productId]/',
            query: {
              organizationSlug: product.organization.slug,
              productId: product.id,
            },
          }}
        />
      ) : null}

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>

        <ProductDetails
          product={product}
          isProductInCart={isProductInCart}
          isProductBeingAddedToCart={isProductBeingAddedToCart}
          onAddToCart={handleAddProductToCart}
          onRemoveFromCart={handleRemoveProductFromCart}
        />
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });

    const organizationSlug = context.params.organizationSlug as string;
    const productSlug = context.params.productSlug as string;

    await Promise.all([
      store.dispatch(fetchOrganization({ organizationSlug, accessToken })),
      store.dispatch(
        fetchProduct({ organizationSlug, productSlug, accessToken })
      ),
    ]);

    const { organization } = store.getState();
    const { product } = store.getState();

    if (organization.error?.status === 404 || product.error?.status === 404) {
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

function addProductJsonLd(product: Product) {
  const id = getProductId({
    organizationSlug: product.organization.slug,
    productSlug: product.slug,
  });
  const url = `${ROOT_URL}/${product.organization.slug}/products/${product.slug}/`;
  const category = PRODUCT_CATEGORY_LABELS[product.category] || '';
  return {
    __html: `{
      "@context": "https://schema.org/",
      "@type": "Product",
      "@id": "${id}",
      "identifier": "${id}",
      "productID": "${id}",
      "name": "${product.name}",
      "image": "${product.photo}",
      "category": "${category}",
      "offers": {
        "@type": "Offer",
        "price": ${product.price},
        "priceCurrency": "USD"
      },
      "url": "${url}"
    }`,
  };
}
