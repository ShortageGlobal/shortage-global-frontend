import type { CancelTokenSource } from 'axios';
import {
  PRODUCT_CATEGORY_KEY,
  PRODUCT_CATEGORY_ALL_KEY,
  NOTIFICATION_TYPE,
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
  | (typeof PRODUCT_CATEGORY_KEY)[CategoryKey]
  | typeof PRODUCT_CATEGORY_ALL_KEY;

type NotificationTypeKey = keyof typeof NOTIFICATION_TYPE;
export type NotificationType = (typeof NOTIFICATION_TYPE)[NotificationTypeKey];

type PackageTypeKey = keyof typeof PACKAGE_TYPE;
export type PackageType = (typeof PACKAGE_TYPE)[PackageTypeKey];

type PackageStatusKey = keyof typeof PACKAGE_STATUS;
export type PackageStatus = (typeof PACKAGE_STATUS)[PackageStatusKey];

export type CountryChoice = { display_name: string; value: string };

export type Profile = {
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  nonprofitAdmin?: boolean;
};

export type Notification = {
  key: number;
  message: string;
  type: NotificationType;
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
  accessToken?: string;
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
  logo: string;
  is_draft: boolean;
  is_verified: boolean;
};

export type ExternalOrganizationPreview = {
  name: string;
  url: string;
  logo: string;
};

export type Organization = OrganizationPreview & {
  description?: string;
  requested_goods?: string;
  mission_description?: string;
  meta_description?: string;
  url?: string;
  banner?: string;
  deadline?: string;
};

export type AccountOrganization = Organization & {
  ein_number?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state_province_region?: string;
  zip?: string;
  country?: string;
  representative_first_name?: string;
  representative_last_name?: string;
  representative_email?: string;
  representative_url?: string;
  representative_phone_number?: string;
  representative_signature?: string;
  tax_deduction_receipt_preamble?: string;
  tax_deduction_receipt_legal_information?: string;
  is_verified: boolean;
  is_draft: boolean;
  updated_at?: string;
  created_at?: string;
};

export type AccountDeliveryInstruction = {
  id: number;
  name: string;
  description?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state_province_region: string;
  zip: string;
  country: string;
  phone_number?: string;
  comment?: string;
};

export type Instruction = {
  name: string;
  description?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state_province_region: string;
  zip: string;
  country: string;
  phone_number?: string;
  comment?: string;
};

type ProductBase = {
  id?: number;
  name: string;
  slug: Slug;
  category: (typeof PRODUCT_CATEGORY_KEY)[CategoryKey];
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

export type AccountProduct = {
  id: number | string;
  name: string;
  slug: Slug;
  category: (typeof PRODUCT_CATEGORY_KEY)[CategoryKey];
  photo?: string;
  price?: number;
  requested_amount: number;
  top_priority: boolean;
  is_public: boolean;
  description?: string;
  position?: number;
  created_at?: string;
};

export type AccountCampaignPreview = {
  uuid: Uuid;
  name: string;
  slug: Slug;
  banner: string;
  is_draft: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type AccountCampaign = AccountCampaignPreview & {
  description?: string;
  requested_goods?: string;
  mission_description?: string;
  meta_description?: string;
  banner?: string;
  deadline?: string;
};

export type OnlineStore = {
  url: string;
  name: string;
};

export type CreatePackageItemParams = {
  product: Slug;
  quantity: number;
};

export type PackageItem = {
  product: ProductBase;
  quantity: number;
};

export type AccountOrganizationPackageItem = {
  product: ProductBase & {
    id: number;
    is_deleted: boolean;
    top_priority: boolean;
    is_public: boolean;
  };
  quantity: number;
};

export type PackageLog = {
  status: PackageStatus;
  created_at: string;
};

export type Package = {
  type: PackageType;
  uuid: Uuid;

  need_tax_deduction: boolean;
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
  tax_deduction_receipt?: string;

  delivery_company?: string;
  tracking_code?: string;
  note?: string;
  photo?: string;
  checkout_url?: string;
  status: PackageStatus;
  created_at?: string;
  items?: PackageItem[];
  organization?: OrganizationPreview;
};

export type AccountOrganizationPackage = {
  type: PackageType;
  uuid: Uuid;

  need_tax_deduction: boolean;
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
  tax_deduction_receipt?: string;

  delivery_company?: string;
  tracking_code?: string;
  note?: string;
  photo?: string;
  checkout_url?: string;
  status: PackageStatus;
  created_at?: string;
  items?: AccountOrganizationPackageItem[];
  blog_posts?: AccountBlogPost['uuid'][];
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
  agreed_to_terms_of_use: boolean;
  need_tax_deduction: boolean;
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

export type BlogPostPreview = {
  uuid: Uuid;
  title: string;
  slug: Slug;
  image?: string;
  created_at: string;
  updated_at: string;
  organization: OrganizationPreview;
  is_draft: boolean;
};

export type BlogPost = BlogPostPreview & {
  content: string;
  meta_description?: string;
};

export type AccountBlogPost = {
  uuid: Uuid;
  title: string;
  slug: Slug;
  image?: string;
  content: string;
  meta_description?: string;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
};

export type OrganizationChecklistSeverity = 'WARNING' | 'ERROR';

export type OrganizationChecklistRemark = {
  code: string;
  message: string;
  severity: OrganizationChecklistSeverity;
};

export type OrganizationChecklist = {
  page: OrganizationChecklistRemark[];
  products: OrganizationChecklistRemark[];
  instructions: OrganizationChecklistRemark[];
  tax_information: OrganizationChecklistRemark[];
};
