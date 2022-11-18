import type { CartItem, Organization, Product } from 'core/api/types';

type WindowWithDataLayer = Window & {
  dataLayer: Record<string, any>[];
};

declare const window: WindowWithDataLayer;

const getProductId = ({ organizationSlug, productSlug }) =>
  `${organizationSlug} / ${productSlug}`;

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
export const trackProceedToDonate = () => {
  window.dataLayer.push({
    event: 'proceedToDonate',
  });
};

// User filled in and submitted Donation Details form
export const trackSubmitDonationDetails = () => {
  window.dataLayer.push({
    event: 'submitDonationDetails',
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
  items: {
    productSlug: Product['slug'];
    productPrice: Product['price'];
    productName: Product['name'];
    quantity: CartItem['quantity'];
  }[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'clickOrderItems',
    organizationSlug,
    organizationName,
    items: items.map((item) => {
      return {
        ...item,
        productId: getProductId({
          organizationSlug,
          productSlug: item.productSlug,
        }),
      };
    }),
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
  items: {
    productSlug: Product['slug'];
    productPrice: Product['price'];
    productName: Product['name'];
    quantity: CartItem['quantity'];
  }[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'clickDonateWhatIHave',
    organizationSlug,
    organizationName,
    items: items.map((item) => {
      return {
        ...item,
        productId: getProductId({
          organizationSlug,
          productSlug: item.productSlug,
        }),
      };
    }),
    totalPrice,
  });
};

// User opened a "Package Registration" page
export const trackPackageRegistrationView = ({
  organizationSlug,
  organizationName,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
}) => {
  window.dataLayer.push({
    event: 'packageRegistrationView',
    organizationSlug,
    organizationName,
  });
};

// User opened a "Package Status" page right after successful registration of a package (either Funded or Sent)
export const trackPackageRegistraionSuccess = ({
  organizationSlug,
  organizationName,
  items,
  totalPrice,
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  items: {
    productSlug: Product['slug'];
    productPrice: Product['price'];
    productName: Product['name'];
    quantity: CartItem['quantity'];
  }[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'packageRegistraionSuccess',
    organizationSlug,
    organizationName,
    items: items.map((item) => {
      return {
        ...item,
        productId: getProductId({
          organizationSlug,
          productSlug: item.productSlug,
        }),
      };
    }),
    totalPrice,
  });
};
