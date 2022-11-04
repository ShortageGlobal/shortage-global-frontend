import type { CancelTokenSource } from 'axios';
import {
  PRODUCT_CATEGORY_KEY,
  PRODUCT_CATEGORY_ALL_KEY,
  PACKAGE_TYPE,
  PACKAGE_STATUS,
} from 'core/constants';

export type AxiosSerializedError = {
  status: number;
  statusText: string;
  code: string;
  message: string;
  data: unknown;
};

export type Limit = number;
export type Offset = number;
export type Slug = string;
export type Uuid = string;
export type JWTToken = string;

type CategoryKey = keyof typeof PRODUCT_CATEGORY_KEY;
export type Category =
  | typeof PRODUCT_CATEGORY_KEY[CategoryKey]
  | typeof PRODUCT_CATEGORY_ALL_KEY;

export type PackageTypeKey = keyof typeof PACKAGE_TYPE;
export type PackageType = typeof PACKAGE_TYPE[PackageTypeKey];

export type PackageStatusKey = keyof typeof PACKAGE_STATUS;
export type PackageStatus = typeof PACKAGE_STATUS[PackageStatusKey];

export type CountryChoice = { display_name: string; value: string };

export type Profile = {
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

export type PaginationParams = {
  limit?: Limit;
  offset?: Offset;
};

export type CancelTokenParams = {
  cancelToken?: CancelTokenSource;
};

export type PaginationWithCancelTokenParams = PaginationParams &
  CancelTokenParams;

export type OrganizationSlugParams = CancelTokenParams & {
  organizationSlug: Slug;
};

export type ProductSlugParams = OrganizationSlugParams & {
  productSlug: Slug;
};

export type CartUuidParams = CancelTokenParams & {
  cartId: Uuid;
};

export type PaginatedResponse<Result> = {
  count: number;
  next?: string;
  previous?: string;
  results: Result[];
};

export type OrganizationPreview = {
  name: string;
  slug: Slug;
  logo?: string;
};

export type Organization = OrganizationPreview & {
  description?: string;
  url?: string;
  banner?: string;
};

export type Instruction = {
  name: string;
  description: string;
  country: string;
};

type ProductBase = {
  name: string;
  slug: Slug;
  category: Category;
  photo?: string;
  price?: number;
  requested_amount: number;
  top_priority: boolean;
  organization: OrganizationPreview;
};

export type ProductPreview = ProductBase & {
  position?: number;
};

export type Product = ProductBase & {
  description?: string;
};

export type OnlineStore = {
  url: string;
  name: string;
};

export type PackageItem = {
  product: Slug;
  quantity: number;
};

export type Package = {
  type: PackageType;
  uuid: Uuid;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone_number?: string;
  delivery_company: string;
  tracking_code: string;
  note?: string;
  photo?: string;
  checkout_url?: string;
  status: PackageStatus;
};

export type CreateCartItem = {
  organization_slug: Organization['slug'];
  product_slug: Product['slug'];
  quantity: number;
};

export type CartItem = {
  uuid: Uuid;
  product: ProductBase;
  quantity: number;
  created_at: string;
};

export type Cart = {
  uuid: Uuid;
  created_at: string;
  items: CartItem[];
  need_tax_deduction?: boolean;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state_province_region?: string;
  zip?: string;
  country?: string;
};
