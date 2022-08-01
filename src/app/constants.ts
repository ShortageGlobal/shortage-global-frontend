export const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT;

// IMPORTANT: the list of category keys must be synchronized with backend
export const PRODUCT_CATEGORY_KEY = Object.freeze({
  VITAL_GOODS: 'VITAL_GOODS',
  HEALTHCARE: 'HEALTHCARE',
  EDUCATION: 'EDUCATION',
  BABY_CARE: 'BABY_CARE',
  SAVE_ANIMALS: 'SAVE_ANIMALS',
});

export const PRODUCT_CATEGORY_DETAILS = Object.freeze({
  [PRODUCT_CATEGORY_KEY.VITAL_GOODS]: { name: 'Vital Goods' },
  [PRODUCT_CATEGORY_KEY.HEALTHCARE]: { name: 'Healthcare' },
  [PRODUCT_CATEGORY_KEY.EDUCATION]: { name: 'Education' },
  [PRODUCT_CATEGORY_KEY.BABY_CARE]: { name: 'Baby Care' },
  [PRODUCT_CATEGORY_KEY.SAVE_ANIMALS]: { name: 'Save Animals' },
});

// IMPORTANT: the list of package statuses must be synchronized with backend
export const PACKAGE_STATUS = Object.freeze({
  REGISTERED: 'REGISTERED',
  CONFIRMED: 'CONFIRMED',
  DELIVERED: 'DELIVERED',
});
