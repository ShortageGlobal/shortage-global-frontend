import { getProductId } from 'core/helpers';
import type {
  Campaign,
  CartItem,
  Organization,
  Package,
  Product,
} from 'core/api/types';

type WindowWithDataLayer = Window & {
  dataLayer: Record<string, any>[];
};

type ProductItem = {
  productSlug: Product['slug'];
  productPrice: Product['price'];
  productName: Product['name'];
  quantity: CartItem['quantity'];
  organizationSlug: Organization['slug'];
};

declare const window: WindowWithDataLayer;

// For GoogleAnalytics we need items to be in a certain format.
// We didn't figure out how to format arrays on the Google Tag Manager platform
function formatProducts({ items }: { items: ProductItem[] }) {
  return items.map((item) => {
    return {
      item_id: getProductId({
        organizationSlug: item.organizationSlug,
        productSlug: item.productSlug,
      }),
      item_name: item.productName,
      quantity: item.quantity,
      item_category: item.organizationSlug,
      price: item.productPrice,
      item_brand: 'Shortage',
      currency: 'USD',
    };
  });
}

// Another page is opened. Fired on routeChangeComplete
export const trackPageView = (url: string) => {
  window.dataLayer.push({
    event: 'pageView',
    page: url,
  });
};

// User opened an organization page
export const trackOrganizationView = ({
  organizationSlug,
  organizationName,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
}) => {
  window.dataLayer.push({
    event: 'organizationView',
    organizationSlug,
    organizationName,
  });
};

// User opened a campaign page
export const trackCampaignView = ({
  organizationSlug,
  organizationName,
  campaignSlug,
  campaignUuid,
  campaignName,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  campaignSlug: Campaign['slug'];
  campaignUuid: Campaign['uuid'];
  campaignName: Campaign['name'];
}) => {
  window.dataLayer.push({
    event: 'campaignView',
    organizationSlug,
    organizationName,
    campaignSlug,
    campaignUuid,
    campaignName,
  });
};

// User opened a campaign product page
export const trackCampaignProductView = ({
  organizationSlug,
  organizationName,
  campaignSlug,
  campaignUuid,
  campaignName,
  productSlug,
  productName,
  productPrice,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  campaignSlug: Campaign['slug'];
  campaignUuid: Campaign['uuid'];
  campaignName: Campaign['name'];
  productSlug: Product['slug'];
  productName: Product['name'];
  productPrice: Product['price'];
}) => {
  window.dataLayer.push({
    event: 'productView',
    organizationSlug,
    organizationName,
    campaignSlug,
    campaignUuid,
    campaignName,
    productSlug,
    productName,
    productPrice,
    productId: getProductId({ organizationSlug, productSlug }),
  });
};

// User opened a product page
export const trackProductView = ({
  organizationSlug,
  organizationName,
  productSlug,
  productName,
  productPrice,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  productSlug: Product['slug'];
  productName: Product['name'];
  productPrice: Product['price'];
}) => {
  window.dataLayer.push({
    event: 'productView',
    organizationSlug,
    organizationName,
    productSlug,
    productName,
    productPrice,
    productId: getProductId({ organizationSlug, productSlug }),
  });
};

// User added a product to a cart
export const trackAddToCart = ({
  organizationSlug,
  organizationName,
  campaignSlug,
  campaignUuid,
  campaignName,
  productSlug,
  productName,
  productPrice,
  quantity,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  campaignSlug: Campaign['slug'];
  campaignUuid: Campaign['uuid'];
  campaignName: Campaign['name'];
  productSlug: Product['slug'];
  productName: Product['name'];
  productPrice: Product['price'];
  quantity: CartItem['quantity'];
}) => {
  window.dataLayer.push({
    event: 'addToCart',
    organizationSlug,
    organizationName,
    campaignSlug,
    campaignUuid,
    campaignName,
    productSlug,
    productName,
    productPrice,
    productId: getProductId({ organizationSlug, productSlug }),
    quantity,
  });
};

// User submitted the "Nonprofit Registration" form
export const trackNonprofitRegistrationRequest = () => {
  window.dataLayer.push({
    event: 'nonprofitRegistrationRequest',
  });
};

// User submitted the "Demo Request" form
export const trackDemoRequest = () => {
  window.dataLayer.push({
    event: 'demoRequest',
  });
};

// User clicked the "Proceed to donate" button
export const trackProceedToDonate = ({
  items,
  totalPrice,
}: {
  items: ProductItem[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'proceedToDonate',
    items: formatProducts({ items }),
    totalPrice,
  });
};

// User filled in and submitted Donation Details form
export const trackSubmitDonationDetails = ({
  items,
  totalPrice,
}: {
  items: ProductItem[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'submitDonationDetails',
    items: formatProducts({ items }),
    totalPrice,
  });
};

// User clicked the "Order Items" button
export const trackClickOrderItems = ({
  organizationSlug,
  organizationName,
  campaignSlug,
  campaignUuid,
  campaignName,
  items,
  totalPrice,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  campaignSlug?: Campaign['slug'];
  campaignUuid?: Campaign['uuid'];
  campaignName?: Campaign['name'];
  items: ProductItem[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'clickOrderItems',
    organizationSlug,
    organizationName,
    campaignSlug,
    campaignUuid,
    campaignName,
    items: formatProducts({ items }),
    totalPrice,
  });
};

// User clicked the "Donate What I Have" button
export const trackClickDonateWhatIHave = ({
  organizationSlug,
  organizationName,
  campaignSlug,
  campaignUuid,
  campaignName,
  items,
  totalPrice,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  campaignSlug?: Campaign['slug'];
  campaignUuid?: Campaign['uuid'];
  campaignName?: Campaign['name'];
  items: ProductItem[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'clickDonateWhatIHave',
    organizationSlug,
    organizationName,
    campaignSlug,
    campaignUuid,
    campaignName,
    items: formatProducts({ items }),
    totalPrice,
  });
};

// User opened a "Package Registration" page
export const trackPackageRegistrationView = ({
  organizationSlug,
  organizationName,
  campaignSlug,
  campaignUuid,
  campaignName,
  items,
  totalPrice,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  campaignSlug?: Campaign['slug'];
  campaignUuid?: Campaign['uuid'];
  campaignName?: Campaign['name'];
  items: ProductItem[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'packageRegistrationView',
    organizationSlug,
    organizationName,
    campaignSlug,
    campaignUuid,
    campaignName,
    items: formatProducts({ items }),
    totalPrice,
  });
};

// User opened a "Package Status" page right after successful registration of a package (either Funded or Sent)
export const trackPackageRegistraionSuccess = ({
  packageId,
  organizationSlug,
  organizationName,
  items,
  totalPrice,
}: {
  packageId: Package['uuid'];
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  items: ProductItem[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'packageRegistraionSuccess',
    packageId,
    organizationSlug,
    organizationName,
    items: formatProducts({ items }),
    totalPrice,
  });
};

// User left a note for a package on the donation status page
export const trackPackageLeaveNote = () => {
  window.dataLayer.push({ event: 'packageLeaveNote' });
};
