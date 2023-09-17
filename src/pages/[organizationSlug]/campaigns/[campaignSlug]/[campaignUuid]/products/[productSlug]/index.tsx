import { useState, useMemo, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';
import * as gtm from 'core/tracking/gtm';
import { extractAccessTokenFromSession } from 'core/helpers';
import { isRequestCancel, useAppSelector, useCart } from 'core/hooks';
import { wrapper } from 'core/store';
import { getProductId } from 'core/helpers';
import { fetchOrganization } from 'core/store/slices/organization';
import { fetchCampaign } from 'core/store/slices/campaign';
import {
  selectCampaignProduct,
  fetchCampaignProduct,
} from 'core/store/slices/campaign-product';
import { DraftWarning } from 'components/draft-warning/draft-warning';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
  getCampaignCrumb,
  getCampaignProductCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { ProductDetails } from 'components/products/product-details/product-details';
import { ROOT_URL, PRODUCT_CATEGORY_LABELS } from 'core/constants';
import type { NextPageWithLayout } from 'pages/_app';
import type { Product } from 'core/api/types';

const CampaignProductPage: NextPageWithLayout = () => {
  const { campaignProduct } = useAppSelector(selectCampaignProduct);

  const { getCartItem, addToCart, deleteFromCart } = useCart();

  const [isProductBeingAddedToCart, setIsProductBeingAddedToCart] =
    useState(false);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getOrganizationCrumb({
        organizationSlug: campaignProduct.organization.slug,
        organizationName: campaignProduct.organization.name,
      }),
      getCampaignCrumb({
        organizationSlug: campaignProduct.organization.slug,
        campaignSlug: campaignProduct.campaign.slug,
        campaignUuid: campaignProduct.campaign.uuid,
        campaignName: campaignProduct.campaign.name,
      }),
      getCampaignProductCrumb({
        organizationSlug: campaignProduct.organization.slug,
        campaignSlug: campaignProduct.campaign.slug,
        campaignUuid: campaignProduct.campaign.uuid,
        productSlug: campaignProduct.slug,
        productName: campaignProduct.name,
        isActive: true,
      }),
    ];
  }, [campaignProduct]);

  // track page view
  useEffect(() => {
    gtm.trackCampaignProductView({
      organizationSlug: campaignProduct.organization.slug,
      organizationName: campaignProduct.organization.name,
      campaignSlug: campaignProduct.campaign.slug,
      campaignUuid: campaignProduct.campaign.uuid,
      campaignName: campaignProduct.campaign.name,
      productSlug: campaignProduct.slug,
      productPrice: campaignProduct.price,
      productName: campaignProduct.name,
    });
  }, [
    campaignProduct?.organization.slug,
    campaignProduct?.organization.name,
    campaignProduct?.campaign?.slug,
    campaignProduct?.campaign?.name,
    campaignProduct?.campaign?.uuid,
    campaignProduct?.slug,
    campaignProduct?.price,
    campaignProduct?.name,
  ]);

  const cartItem = useMemo(() => {
    return getCartItem({
      productSlug: campaignProduct.slug,
      organizationSlug: campaignProduct.organization.slug,
      campaignSlug: campaignProduct.campaign.slug,
      campaignUuid: campaignProduct.campaign.uuid,
    });
  }, [getCartItem, campaignProduct]);

  const isProductInCart = useMemo(() => {
    return !!cartItem;
  }, [cartItem]);

  const handleAddProductToCart = useCallback(async () => {
    setIsProductBeingAddedToCart(true);
    try {
      await addToCart({
        organization_slug: campaignProduct.organization.slug,
        organization_name: campaignProduct.organization.name,
        campaign_slug: campaignProduct.campaign.slug,
        campaign_uuid: campaignProduct.campaign.uuid,
        campaign_name: campaignProduct.campaign.name,
        product_slug: campaignProduct.slug,
        product_price: campaignProduct.price,
        product_name: campaignProduct.name,
        quantity: 1,
      });
      setIsProductBeingAddedToCart(false);
    } catch (rejection) {
      if (isRequestCancel(rejection)) {
        return;
      }
      setIsProductBeingAddedToCart(false);
    }
  }, [campaignProduct, addToCart]);

  const handleRemoveProductFromCart = useCallback(() => {
    deleteFromCart({
      cartItemId: cartItem.uuid,
    });
  }, [cartItem, deleteFromCart]);

  return (
    <>
      <Head>
        <title>{`${campaignProduct.name} | ${campaignProduct.campaign.name} | Shortage`}</title>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addProductJsonLd(campaignProduct)}
          key="campaign-product-jsonld"
        />
      </Head>

      {campaignProduct.organization.is_draft ||
      !campaignProduct.organization.is_verified ? (
        <DraftWarning
          adminHref={{
            pathname:
              '/private/manage-nonprofit/[organizationSlug]/requested-goods/[productId]/',
            query: {
              organizationSlug: campaignProduct.organization.slug,
              productId: campaignProduct.id,
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
          product={campaignProduct}
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
    const campaignSlug = context.params.campaignSlug as string;
    const campaignUuid = context.params.campaignUuid as string;
    const productSlug = context.params.productSlug as string;

    await Promise.all([
      store.dispatch(fetchOrganization({ organizationSlug, accessToken })),
      store.dispatch(
        fetchCampaign({
          organizationSlug,
          campaignSlug,
          campaignUuid,
          accessToken,
        })
      ),
      store.dispatch(
        fetchCampaignProduct({
          organizationSlug,
          campaignSlug,
          campaignUuid,
          productSlug,
          accessToken,
        })
      ),
    ]);

    const { organization, campaign, campaignProduct } = store.getState();

    if (
      organization.error?.status === 404 ||
      campaign.error?.status === 404 ||
      campaignProduct.error?.status === 404
    ) {
      return {
        notFound: true,
      };
    }

    return {
      props: {},
    };
  }
);

export default CampaignProductPage;

function addProductJsonLd(product: Product) {
  const id = getProductId({
    organizationSlug: product.organization.slug,
    productSlug: product.slug,
  });
  const url = `${ROOT_URL}/${product.organization.slug}/campaigns/${product.campaign?.slug}/${product.campaign.uuid}/products/${product.slug}/`;
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
