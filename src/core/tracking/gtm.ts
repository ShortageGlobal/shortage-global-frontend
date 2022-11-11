import type { CartItem, Organization, Product } from 'core/api/types';

type WindowWithDataLayer = Window & {
  dataLayer: Record<string, any>[];
};

declare const window: WindowWithDataLayer;

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
}: {
  organizationSlug: Organization['slug'];
}) => {
  window.dataLayer.push({
    event: 'organizationView',
    organizationSlug,
  });
};

// User opened a product page
export const trackProductView = ({
  organizationSlug,
  productSlug,
  productPrice,
}: {
  organizationSlug: Organization['slug'];
  productSlug: Product['slug'];
  productPrice: Product['price'];
}) => {
  window.dataLayer.push({
    event: 'productView',
    organizationSlug,
    productSlug,
    productPrice,
  });
};

// User added a product to a cart
export const trackAddToCart = ({
  organizationSlug,
  productSlug,
  productPrice,
  quantity,
}: {
  organizationSlug: Organization['slug'];
  productSlug: Product['slug'];
  productPrice: Product['price'];
  quantity: CartItem['quantity'];
}) => {
  window.dataLayer.push({
    event: 'addToCart',
    organizationSlug,
    productSlug,
    productPrice,
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
  items,
}: {
  organizationSlug: Organization['slug'];
  items: {
    productSlug: Product['slug'];
    productPrice: Product['price'];
    quantity: CartItem['quantity'];
  }[];
}) => {
  window.dataLayer.push({
    event: 'clickOrderItems',
    organizationSlug,
    items,
  });
};

// User clicked the "Donate What I Have" button
export const trackClickDonateWhatIHave = ({
  organizationSlug,
  items,
}: {
  organizationSlug: Organization['slug'];
  items: {
    productSlug: Product['slug'];
    productPrice: Product['price'];
    quantity: CartItem['quantity'];
  }[];
}) => {
  window.dataLayer.push({
    event: 'clickDonateWhatIHave',
    organizationSlug,
    items,
  });
};

// User opened a "Package Registration" page
export const trackPackageRegistrationView = ({
  organizationSlug,
}: {
  organizationSlug: Organization['slug'];
}) => {
  window.dataLayer.push({
    event: 'packageRegistrationView',
    organizationSlug,
  });
};

// User opened a "Package Status" page right after successful registration of a package (either Funded or Sent)
export const trackPackageRegistraionSuccess = ({
  organizationSlug,
  items,
  totalPrice,
}: {
  organizationSlug: Organization['slug'];
  items: {
    productSlug: Product['slug'];
    productPrice: Product['price'];
    quantity: CartItem['quantity'];
  }[];
  totalPrice: number;
}) => {
  window.dataLayer.push({
    event: 'packageRegistraionSuccess',
    organizationSlug,
    items,
    totalPrice,
  });
};
