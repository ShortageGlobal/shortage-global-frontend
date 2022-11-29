import { getProductId } from 'core/helpers';
import type { CartItem, Organization, Package, Product } from 'core/api/types';

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
  productSlug,
  productName,
  productPrice,
  quantity,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  productSlug: Product['slug'];
  productName: Product['name'];
  productPrice: Product['price'];
  quantity: CartItem['quantity'];
}) => {
  window.dataLayer.push({
    event: 'addToCart',
    organizationSlug,
    organizationName,
    productSlug,
    productName,
    productPrice,
    productId: getProductId({ organizationSlug, productSlug }),
    quantity,
  });
};

// User submitted the "Nonprofit Registration" form on the /for-nonprofits page
export const trackNonprofitRegistrationRequest = () => {
  window.dataLayer.push({
    event: 'nonprofitRegistrationRequest',
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
  items,
  totalPrice,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  items: ProductItem[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'clickOrderItems',
    organizationSlug,
    organizationName,
    items: formatProducts({ items }),
    totalPrice,
  });
};

// User clicked the "Donate What I Have" button
export const trackClickDonateWhatIHave = ({
  organizationSlug,
  organizationName,
  items,
  totalPrice,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  items: ProductItem[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'clickDonateWhatIHave',
    organizationSlug,
    organizationName,
    items: formatProducts({ items }),
    totalPrice,
  });
};

// User opened a "Package Registration" page
export const trackPackageRegistrationView = ({
  organizationSlug,
  organizationName,
  items,
  totalPrice,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  items: ProductItem[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'packageRegistrationView',
    organizationSlug,
    organizationName,
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
