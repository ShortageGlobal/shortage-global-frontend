import type { CancelTokenSource } from 'axios';
import { PRODUCT_CATEGORY_KEY, PACKAGE_STATUS } from 'app/constants';

export type Limit = number;
export type Offset = number;
export type Slug = string;

export type CategoryKey = keyof typeof PRODUCT_CATEGORY_KEY;
export type Category = typeof PRODUCT_CATEGORY_KEY[CategoryKey];

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
};

export type ProductPreview = ProductBase & {
  position?: number;
  organization_name: string;
  organization_slug: Slug;
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

export type PackageCreationParams = OrganizationSlugParams & {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  deliveryCompany: string;
  trackingCode: string;
  note?: string;
  photo?: string;
  items: PackageItem[];
};

export type PackageStatusResponse = {
  delivery_company: string;
  tracking_code: string;
  created_at: string;
  status: PackageStatus;
};
