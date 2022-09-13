import type { CancelTokenSource } from 'axios';
import {
  PRODUCT_CATEGORY_KEY,
  PRODUCT_CATEGORY_ALL_KEY,
  PACKAGE_STATUS,
} from 'app/constants';

export type AxiosSerializedError = {
  status: number;
  statusText: string;
  code: string;
  message: string;
  data: unknown;
  headers: unknown;
};

export type Limit = number;
export type Offset = number;
export type Slug = string;
export type Uuid = string;

type CategoryKey = keyof typeof PRODUCT_CATEGORY_KEY;
export type Category =
  | typeof PRODUCT_CATEGORY_KEY[CategoryKey]
  | typeof PRODUCT_CATEGORY_ALL_KEY;

export type PackageStatusKey = keyof typeof PACKAGE_STATUS;
export type PackageStatus = typeof PACKAGE_STATUS[PackageStatusKey];

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
  photo?: string;
};

export type Organization = OrganizationPreview & {
  description?: string;
  url?: string;
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
  price?: string;
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
  uuid: Uuid;
  full_name?: string;
  email?: string;
  phone_number?: string;
  delivery_company: string;
  tracking_code: string;
  note?: string;
  photo?: string;
  status: PackageStatus;
};

export type CreateCartItem = {
  product_slug: string;
  organization_slug: string;
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
};
