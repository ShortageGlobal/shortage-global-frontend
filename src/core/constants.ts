export const API_PROTOCOL =
  process.env.NEXT_PUBLIC_SECURE_API_PROTOCOL === 'true' ? 'https:' : 'http:';
export const API_HOSTNAME = process.env.NEXT_PUBLIC_API_HOSTNAME;
export const API_PORT = process.env.NEXT_PUBLIC_API_PORT;
export const API_ROOT = `${API_PROTOCOL}//${API_HOSTNAME}${
  API_PORT ? `:${API_PORT}` : ''
}`;

export const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL;
export const IS_STAGING = process.env.NEXT_PUBLIC_ENV === 'staging';
export const IS_BROWSER = typeof window !== 'undefined';

// Live Chat
export const LIVE_CHAT_LICENCE_ID =
  process.env.NEXT_PUBLIC_LIVE_CHAT_LICENCE_ID;

// Google Tag Manager
export const GOOGLE_TAG_MANAGER_ID =
  process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
export const GOOGLE_TAG_MANAGER_SCRIPT_SRC_EXTRA =
  process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_SCRIPT_SRC_EXTRA;
export const GOOGLE_TAG_MANAGER_NOSCRIPT_SRC =
  process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_NOSCRIPT_SRC;

// How long jwt token lives on the backend (django) before expiring (in seconds).
// Make it a bit smaller than the real value to compensate networking lag.
export const BACKEND_JWT_MAX_AGE = 60 * 60 * 0.9; // 1 hour * 0.75 = 54 minutes

// How long jwt token lives on the client (next-auth.js) before expiring (in seconds).
// Should not be greater than backend refresh token lifetime.
export const CLIENT_JWT_MAX_AGE = 14 * 24 * 60 * 60; // 14 days

// A time interval (in seconds) after which the session will be re-fetched.
// If set to `0` (default), the session is not polled.
export const CLIENT_SESSION_REFETCH_INTERVAL = BACKEND_JWT_MAX_AGE / 2; // 27 minutes

// !IMPORTANT: the list of category keys must be synchronized with backend
export const PRODUCT_CATEGORY_KEY = Object.freeze({
  VITAL_GOODS: 'VITAL_GOODS',
  HEALTHCARE: 'HEALTHCARE',
  EDUCATION: 'EDUCATION',
  BABY_CARE: 'BABY_CARE',
  SAVE_ANIMALS: 'SAVE_ANIMALS',
  HOUSEHOLD_ITEMS: 'HOUSEHOLD_ITEMS',
  FOOD: 'FOOD',
  TOYS: 'TOYS',
});

export const PRODUCT_CATEGORY_ALL_KEY = '_ALL_';

export const PRODUCT_CATEGORY_LABELS = Object.freeze({
  [PRODUCT_CATEGORY_ALL_KEY]: 'All',
  [PRODUCT_CATEGORY_KEY.VITAL_GOODS]: 'Vital Goods',
  [PRODUCT_CATEGORY_KEY.HEALTHCARE]: 'Healthcare',
  [PRODUCT_CATEGORY_KEY.EDUCATION]: 'Education',
  [PRODUCT_CATEGORY_KEY.BABY_CARE]: 'Baby Care',
  [PRODUCT_CATEGORY_KEY.SAVE_ANIMALS]: 'Save Animals',
  [PRODUCT_CATEGORY_KEY.HOUSEHOLD_ITEMS]: 'Household Items',
  [PRODUCT_CATEGORY_KEY.FOOD]: 'Food',
  [PRODUCT_CATEGORY_KEY.TOYS]: 'Toys',
});

export const PRODUCT_CATEGORY_LIST = Object.freeze([
  PRODUCT_CATEGORY_ALL_KEY,
  PRODUCT_CATEGORY_KEY.HEALTHCARE,
  PRODUCT_CATEGORY_KEY.FOOD,
  PRODUCT_CATEGORY_KEY.EDUCATION,
  PRODUCT_CATEGORY_KEY.BABY_CARE,
  PRODUCT_CATEGORY_KEY.HOUSEHOLD_ITEMS,
  PRODUCT_CATEGORY_KEY.SAVE_ANIMALS,
  PRODUCT_CATEGORY_KEY.TOYS,
  PRODUCT_CATEGORY_KEY.VITAL_GOODS,
]);

export const NOTIFICATION_TYPE = Object.freeze({
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
});

export const PACKAGE_TYPE = Object.freeze({
  SENT_BY_DONOR: 'SENT_BY_DONOR',
  FUNDED_BY_DONOR: 'FUNDED_BY_DONOR',
});

export const PACKAGE_TYPE_DISPLAY_LABELS = Object.freeze({
  [PACKAGE_TYPE.SENT_BY_DONOR]: 'Sent',
  [PACKAGE_TYPE.FUNDED_BY_DONOR]: 'Funded',
});

// !IMPORTANT: the list of package statuses must be synchronized with backend
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

export const PACKAGE_STATUS_DISPLAY_LABELS = Object.freeze({
  [PACKAGE_STATUS.REGISTERED]: 'Registered',
  [PACKAGE_STATUS.PAYMENT_CANCELED]: 'Payment Canceled',
  [PACKAGE_STATUS.PAYMENT_FAILED]: 'Payment Failed',
  [PACKAGE_STATUS.PAYMENT_PROCESSING]: 'Processing',
  [PACKAGE_STATUS.PAYMENT_SUCCEEDED]: 'Processing', // same as PAYMENT_PROCESSING
  [PACKAGE_STATUS.CONFIRMED]: 'Confirmed',
  [PACKAGE_STATUS.ON_ITS_WAY]: 'On Its Way',
  [PACKAGE_STATUS.DELIVERED]: 'Delivered',
});

export const PACKAGE_STATUS_GLYPHS = Object.freeze({
  [PACKAGE_STATUS.REGISTERED]: '/images/package-status-glyphs/registered.svg',

  [PACKAGE_STATUS.PAYMENT_CANCELED]:
    '/images/package-status-glyphs/payment.svg',
  [PACKAGE_STATUS.PAYMENT_FAILED]: '/images/package-status-glyphs/payment.svg',
  [PACKAGE_STATUS.PAYMENT_PROCESSING]:
    '/images/package-status-glyphs/payment.svg',
  [PACKAGE_STATUS.PAYMENT_SUCCEEDED]:
    '/images/package-status-glyphs/payment.svg',

  [PACKAGE_STATUS.CONFIRMED]: '/images/package-status-glyphs/confirmed.svg',
  [PACKAGE_STATUS.ON_ITS_WAY]: '/images/package-status-glyphs/on_its_way.svg',
  [PACKAGE_STATUS.DELIVERED]: '/images/package-status-glyphs/delivered.svg',
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
export const NONPROFIT_REGISTRATION_FORM_ID = 'nonprofit-registration-form';
export const NONPROFIT_REGISTRATION_EMAIL_INPUT_ID =
  'nonprofit-registration-email-input';

export const PRODUCTS_PAGE_SIZE = 15;

export const BLOG_POSTS_PAGE_SIZE = 15;

// local storage keys
export const CART_ID_KEY = 'cart-id';

// page keys used for redirects
export const PAGE_KEY = Object.freeze({
  DONATION_CART: 'donation_cart',
  PACKAGE_REGISTRATION: 'package_registration',
});

// pagination
export const PAGE_SIZES = [15, 30, 45];
export const DEFAULT_PAGE_SIZE = 15;
