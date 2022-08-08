export const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT;

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
  },
  [PRODUCT_CATEGORY_KEY.VITAL_GOODS]: {
    key: PRODUCT_CATEGORY_KEY.VITAL_GOODS,
    queryFilter: PRODUCT_CATEGORY_KEY.VITAL_GOODS,
    name: 'Vital Goods',
  },
  [PRODUCT_CATEGORY_KEY.HEALTHCARE]: {
    key: PRODUCT_CATEGORY_KEY.HEALTHCARE,
    queryFilter: PRODUCT_CATEGORY_KEY.HEALTHCARE,
    name: 'Healthcare',
  },
  [PRODUCT_CATEGORY_KEY.EDUCATION]: {
    key: PRODUCT_CATEGORY_KEY.EDUCATION,
    queryFilter: PRODUCT_CATEGORY_KEY.EDUCATION,
    name: 'Education',
  },
  [PRODUCT_CATEGORY_KEY.BABY_CARE]: {
    key: PRODUCT_CATEGORY_KEY.BABY_CARE,
    queryFilter: PRODUCT_CATEGORY_KEY.BABY_CARE,
    name: 'Baby Care',
  },
  [PRODUCT_CATEGORY_KEY.SAVE_ANIMALS]: {
    key: PRODUCT_CATEGORY_KEY.SAVE_ANIMALS,
    queryFilter: PRODUCT_CATEGORY_KEY.SAVE_ANIMALS,
    name: 'Save Animals',
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

// IMPORTANT: the list of package statuses must be synchronized with backend
export const PACKAGE_STATUS = Object.freeze({
  REGISTERED: 'REGISTERED',
  CONFIRMED: 'CONFIRMED',
  DELIVERED: 'DELIVERED',
});

// used for scrolling
export const NEEDED_SUPPLIES_CONTAINER_ID = 'needed-supplies-header';
