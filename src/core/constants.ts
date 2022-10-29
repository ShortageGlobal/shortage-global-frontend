export const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT;
export const IS_STAGING = process.env.NEXT_PUBLIC_ENV === 'staging';

// Live Chat
export const LIVE_CHAT_LICENCE_ID =
  process.env.NEXT_PUBLIC_LIVE_CHAT_LICENCE_ID;

// Google Analytics
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

// Facebook Pixel
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

// IMPORTANT: the list of category keys must be synchronized with backend
export const PRODUCT_CATEGORY_KEY = Object.freeze({
  VITAL_GOODS: 'VITAL_GOODS',
  HEALTHCARE: 'HEALTHCARE',
  EDUCATION: 'EDUCATION',
  BABY_CARE: 'BABY_CARE',
  SAVE_ANIMALS: 'SAVE_ANIMALS',
});

export const PRODUCT_CATEGORY_ALL_KEY = '_ALL_';

export const PRODUCT_CATEGORY_DETAILS = Object.freeze({
  [PRODUCT_CATEGORY_ALL_KEY]: {
    key: PRODUCT_CATEGORY_ALL_KEY,
    queryFilter: '',
    name: 'All',
    img: '/images/categories/supply_category_all_.svg',
    imgActive: '/images/categories/supply_category_all_selected.svg',
  },
  [PRODUCT_CATEGORY_KEY.VITAL_GOODS]: {
    key: PRODUCT_CATEGORY_KEY.VITAL_GOODS,
    queryFilter: PRODUCT_CATEGORY_KEY.VITAL_GOODS,
    name: 'Vital Goods',
    img: '/images/categories/supply_category_vital_.svg',
    imgActive: '/images/categories/supply_category_vital_selected.svg',
  },
  [PRODUCT_CATEGORY_KEY.HEALTHCARE]: {
    key: PRODUCT_CATEGORY_KEY.HEALTHCARE,
    queryFilter: PRODUCT_CATEGORY_KEY.HEALTHCARE,
    name: 'Healthcare',
    img: '/images/categories/supply_category_health_.svg',
    imgActive: '/images/categories/supply_category_health_selected.svg',
  },
  [PRODUCT_CATEGORY_KEY.EDUCATION]: {
    key: PRODUCT_CATEGORY_KEY.EDUCATION,
    queryFilter: PRODUCT_CATEGORY_KEY.EDUCATION,
    name: 'Education',
    img: '/images/categories/supply_category_education_.svg',
    imgActive: '/images/categories/supply_category_education_selected.svg',
  },
  [PRODUCT_CATEGORY_KEY.BABY_CARE]: {
    key: PRODUCT_CATEGORY_KEY.BABY_CARE,
    queryFilter: PRODUCT_CATEGORY_KEY.BABY_CARE,
    name: 'Baby Care',
    img: '/images/categories/supply_category_baby_.svg',
    imgActive: '/images/categories/supply_category_baby_selected.svg',
  },
  [PRODUCT_CATEGORY_KEY.SAVE_ANIMALS]: {
    key: PRODUCT_CATEGORY_KEY.SAVE_ANIMALS,
    queryFilter: PRODUCT_CATEGORY_KEY.SAVE_ANIMALS,
    name: 'Save Animals',
    img: '/images/categories/supply_category_animals_.svg',
    imgActive: '/images/categories/supply_category_animals_selected.svg',
  },
});

export const PRODUCT_CATEGORY_LIST = Object.freeze([
  PRODUCT_CATEGORY_ALL_KEY,
  PRODUCT_CATEGORY_KEY.VITAL_GOODS,
  PRODUCT_CATEGORY_KEY.HEALTHCARE,
  PRODUCT_CATEGORY_KEY.EDUCATION,
  PRODUCT_CATEGORY_KEY.BABY_CARE,
  PRODUCT_CATEGORY_KEY.SAVE_ANIMALS,
]);

export const PACKAGE_TYPE = Object.freeze({
  SENT_BY_DONOR: 'SENT_BY_DONOR',
  FUNDED_BY_DONOR: 'FUNDED_BY_DONOR',
});

// IMPORTANT: the list of package statuses must be synchronized with backend
export const PACKAGE_STATUS = Object.freeze({
  REGISTERED: 'REGISTERED',
  PAYMENT_CANCELED: 'PAYMENT_CANCELED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_PROCESSING: 'PAYMENT_PROCESSING',
  PAYMENT_SUCCEEDED: 'PAYMENT_SUCCEEDED',
  CONFIRMED: 'CONFIRMED',
  ON_ITS_WAY: 'ON_ITS_WAY',
  DELIVERED: 'DELIVERED',
});

export const PACKAGE_STATUS_LIFECYCLE = Object.freeze({
  [PACKAGE_TYPE.SENT_BY_DONOR]: Object.freeze([
    Object.freeze([
      PACKAGE_STATUS.REGISTERED,
      PACKAGE_STATUS.PAYMENT_CANCELED,
      PACKAGE_STATUS.PAYMENT_FAILED,
      PACKAGE_STATUS.PAYMENT_PROCESSING,
      PACKAGE_STATUS.PAYMENT_SUCCEEDED,
    ]),
    Object.freeze([PACKAGE_STATUS.CONFIRMED, PACKAGE_STATUS.ON_ITS_WAY]),
    Object.freeze([PACKAGE_STATUS.DELIVERED]),
  ]),
  [PACKAGE_TYPE.FUNDED_BY_DONOR]: Object.freeze([
    Object.freeze([PACKAGE_STATUS.REGISTERED]),
    Object.freeze([
      PACKAGE_STATUS.PAYMENT_SUCCEEDED,
      PACKAGE_STATUS.PAYMENT_CANCELED,
      PACKAGE_STATUS.PAYMENT_FAILED,
      PACKAGE_STATUS.PAYMENT_PROCESSING,
    ]),
    Object.freeze([PACKAGE_STATUS.CONFIRMED]),
    Object.freeze([PACKAGE_STATUS.ON_ITS_WAY]),
    Object.freeze([PACKAGE_STATUS.DELIVERED]),
  ]),
});

// used for scrolling
export const REQUESTED_GOODS_CONTAINER_ID = 'most-requested-items';

export const PRODUCTS_PAGE_SIZE = 15;

// local storage keys
export const CART_ID_KEY = 'cart-id';

// page keys used for redirects
export const PAGE_KEY = Object.freeze({
  DONATION_CART: 'donation_cart',
  PACKAGE_REGISTRATION: 'package_registration',
});
