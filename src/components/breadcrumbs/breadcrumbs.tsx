import styles from './breadcrumbs.module.scss';
import classNames from 'classnames';
import { Home } from 'react-feather';
import Link, { LinkProps } from 'next/link';
import { truncateString } from 'core/helpers';
import type {
  Slug,
  Uuid,
  Organization,
  AccountOrganization,
  AccountProduct,
  AccountBlogPost,
  AccountOrganizationPackage,
} from 'core/api/types';
import type { ReactNode } from 'react';

type BreadcrumbItem = {
  key?: string;
  label?: string | ReactNode;
  href?: LinkProps['href'];
  className?: string;
  isActive?: boolean;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className={classNames('breadcrumb', styles.breadcrumb)}>
        {items.map((item) => {
          const label =
            typeof item.label === 'string'
              ? truncateString({ value: item.label, maxLength: 50 })
              : item.label;
          return (
            <li
              key={item.key}
              className={classNames(
                'breadcrumb-item text-truncate',
                item.className,
                {
                  active: item.isActive,
                }
              )}
              {...(item.isActive ? { 'aria-current': 'page' } : {})}
            >
              {item.isActive ? (
                <span>{label}</span>
              ) : (
                <Link href={item.href} className={styles.link}>
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const defaultCrumb = Object.freeze({
  key: 'crumb',
  label: 'Crumb',
  href: '/',
  className: null,
  isActive: false,
});

export const getHomeCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'home',
    label: <Home size="1rem" />,
    href: '/',
    className: styles.homeBreadcrumb,
    ...props,
  });

export const getSignInCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'sign-in',
    label: 'Sign In',
    href: '/account/sign-in/',
    ...props,
  });

export const getCreateAccountCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'register',
    label: 'Create New Account',
    href: '/account/create-account/',
    ...props,
  });

export const getConfirmAccountCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'confirm-account',
    label: 'Confirm Account',
    href: '/account/activate/',
    ...props,
  });

export const getForgotPasswordCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'forgot-password',
    label: 'Forgot Password',
    href: '/account/forgot-password/',
    ...props,
  });

export const getResetPasswordCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'reset-password',
    label: 'Reset Password',
    href: '/account/reset-password/',
    ...props,
  });

export const getProfileCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'profile',
    label: 'Profile',
    href: '/private/profile/',
    ...props,
  });

export const getChangePasswordCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'change-password',
    label: 'Change Password',
    href: '/private/change-password/',
    ...props,
  });

export const getAccountDonationsCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'account-donations',
    label: 'Donations',
    href: '/private/donations/',
    ...props,
  });

export const getMyImpactCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'my-impact',
    label: 'My Impact',
    href: '/private/my-impact/',
    ...props,
  });

export const getAccountDonationDetailsCrumb = ({
  packageId,
  ...props
}: {
  packageId: Uuid;
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'account-donation-details',
    label: 'Donation Details',
    href: {
      pathname: '/private/donations/[packageId]/',
      query: { packageId },
    },
    ...props,
  });

export const getPrivacyPolicyCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'privacy-policy',
    label: 'Privacy Policy',
    href: {
      pathname: '/privacy-policy/',
    },
    ...props,
  });

export const getTermsOfUseCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'terms-of-use',
    label: 'Terms of Use',
    href: {
      pathname: '/terms-of-use/',
    },
    ...props,
  });

export const getForIndividualsCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'for-individuals',
    label: 'For Individuals',
    href: {
      pathname: '/for-individuals/',
    },
    ...props,
  });

export const getForCorporateCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'for-corporate',
    label: 'For Corporate',
    href: {
      pathname: '/for-corporate/',
    },
    ...props,
  });

export const getForNonprofitsCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'for-nonprofits',
    label: 'For Nonprofits',
    href: {
      pathname: '/for-nonprofits/',
    },
    ...props,
  });

export const getDonationDetailsCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'donation-details',
    label: 'Donation Details',
    href: {
      pathname: '/donation/details/',
    },
    ...props,
  });

export const getDonationCartCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'donation-cart',
    label: 'Donation Cart',
    href: {
      pathname: '/donation/details/cart/',
    },
    ...props,
  });

export const getOrganizationCrumb = ({
  organizationSlug,
  organizationName,
  ...props
}: {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'organization-crumb',
    label: organizationName,
    href: {
      pathname: '/[organizationSlug]/',
      query: { organizationSlug },
    },
    ...props,
  });

export const getPackageRegistrationCrumb = ({
  organizationSlug,
  ...props
}: {
  organizationSlug: Organization['slug'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'package-registration',
    label: 'Package Registration',
    href: {
      pathname: '/[organizationSlug]/packages/',
      query: { organizationSlug },
    },
    ...props,
  });

export const getPackageStatusCrumb = ({
  organizationSlug,
  packageId,
  ...props
}: {
  organizationSlug: Organization['slug'];
  packageId: Uuid;
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'package-status',
    label: 'Package Status',
    href: {
      pathname: '/[organizationSlug]/packages/[packageId]/',
      query: { organizationSlug, packageId },
    },
    ...props,
  });

export const getProductCrumb = ({
  organizationSlug,
  productSlug,
  productName,
  ...props
}: {
  organizationSlug: Organization['slug'];
  productSlug: Slug;
  productName: string;
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'product-crumb',
    label: productName,
    href: {
      pathname: '/[organizationSlug]/products/[productSlug]/',
      query: { organizationSlug, productSlug },
    },
    ...props,
  });

export const getOrganizationBlogPostCrumb = ({
  organizationSlug,
  blogPostSlug,
  blogPostTitle,
  ...props
}: {
  organizationSlug: Organization['slug'];
  blogPostSlug: Slug;
  blogPostTitle: string;
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'organization-blog-post-crumb',
    label: blogPostTitle,
    href: {
      pathname: '/[organizationSlug]/impact-stories/[blogPostSlug]/',
      query: { organizationSlug, blogPostSlug },
    },
    ...props,
  });

export const getManageNonprofitChooseCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-choose-crumb',
    label: 'Choose a Nonprofit',
    href: {
      pathname: '/private/manage-nonprofit/choose/',
    },
    ...props,
  });

export const getManageNonprofitRegisterCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-register-crumb',
    label: 'Register a Nonprofit',
    href: {
      pathname: '/private/manage-nonprofit/register/',
    },
    ...props,
  });

export const getManageNonprofitCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-crumb',
    label: 'Manage',
    href: {
      pathname: '/private/manage-nonprofit/',
    },
    ...props,
  });

export const getManageNonprofitRootCrumb = ({
  organizationSlug,
  organizationName,
  ...props
}: {
  organizationSlug: AccountOrganization['slug'];
  organizationName: AccountOrganization['name'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-root-crumb',
    label: organizationName,
    href: {
      pathname: '/private/manage-nonprofit/[organizationSlug]/',
      query: { organizationSlug },
    },
    ...props,
  });

export const getManageNonprofitPageCrumb = ({
  organizationSlug,
  ...props
}: {
  organizationSlug: AccountOrganization['slug'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-page-crumb',
    label: 'Nonprofit Page',
    href: {
      pathname: '/private/manage-nonprofit/[organizationSlug]/page/',
      query: { organizationSlug },
    },
    ...props,
  });

export const getManageNonprofitTaxInformationCrumb = ({
  organizationSlug,
  ...props
}: {
  organizationSlug: AccountOrganization['slug'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-tax-information-crumb',
    label: 'Tax Information',
    href: {
      pathname: '/private/manage-nonprofit/[organizationSlug]/tax-information/',
      query: { organizationSlug },
    },
    ...props,
  });

export const getManageNonprofitDeliveryInstructionCrumb = ({
  organizationSlug,
  ...props
}: {
  organizationSlug: AccountOrganization['slug'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-delivery-instruction-crumb',
    label: 'Delivery Instruction',
    href: {
      pathname:
        '/private/manage-nonprofit/[organizationSlug]/delivery-instruction/',
      query: { organizationSlug },
    },
    ...props,
  });

export const getManageRequestedGoodsCrumb = ({
  organizationSlug,
  ...props
}: {
  organizationSlug: AccountOrganization['slug'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-requested-goods-crumb',
    label: 'Requested Goods',
    href: {
      pathname: '/private/manage-nonprofit/[organizationSlug]/requested-goods/',
      query: { organizationSlug },
    },
    ...props,
  });

export const getManageRequestedGoodsCreateCrumb = ({
  organizationSlug,
  ...props
}: {
  organizationSlug: AccountOrganization['slug'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-requested-goods-create-crumb',
    label: 'Create',
    href: {
      pathname:
        '/private/manage-nonprofit/[organizationSlug]/requested-goods/create/',
      query: { organizationSlug },
    },
    ...props,
  });

export const getManageRequestedGoodsEditCrumb = ({
  organizationSlug,
  productId,
  ...props
}: {
  organizationSlug: AccountOrganization['slug'];
  productId: AccountProduct['id'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-requested-goods-edit-crumb',
    label: 'Edit',
    href: {
      pathname:
        '/private/manage-nonprofit/[organizationSlug]/requested-goods/[productId]/',
      query: { organizationSlug, productId },
    },
    ...props,
  });

export const getManageImpactStoriesCrumb = ({
  organizationSlug,
  ...props
}: {
  organizationSlug: AccountOrganization['slug'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-impact-stories-crumb',
    label: 'Impact Stories',
    href: {
      pathname: '/private/manage-nonprofit/[organizationSlug]/impact-stories/',
      query: { organizationSlug },
    },
    ...props,
  });

export const getManageImpactStoriesCreateCrumb = ({
  organizationSlug,
  ...props
}: {
  organizationSlug: AccountOrganization['slug'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-impact-stories-create-crumb',
    label: 'Create',
    href: {
      pathname:
        '/private/manage-nonprofit/[organizationSlug]/impact-stories/create/',
      query: { organizationSlug },
    },
    ...props,
  });

export const getManageImpactStoriesEditCrumb = ({
  organizationSlug,
  blogPostUuid,
  ...props
}: {
  organizationSlug: AccountOrganization['slug'];
  blogPostUuid: AccountBlogPost['uuid'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-impact-stories-edit-crumb',
    label: 'Edit',
    href: {
      pathname:
        '/private/manage-nonprofit/[organizationSlug]/impact-stories/[blogPostUuid]/',
      query: { organizationSlug, blogPostUuid },
    },
    ...props,
  });

export const getManageDonationsCrumb = ({
  organizationSlug,
  ...props
}: {
  organizationSlug: AccountOrganization['slug'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-donations-crumb',
    label: 'Donations',
    href: {
      pathname: '/private/manage-nonprofit/[organizationSlug]/donations/',
      query: { organizationSlug },
    },
    ...props,
  });

export const getManageDonationDetailsCrumb = ({
  organizationSlug,
  packageId,
  ...props
}: {
  organizationSlug: AccountOrganization['slug'];
  packageId: AccountOrganizationPackage['uuid'];
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'manage-nonprofit-donation-details-crumb',
    label: 'Donation Details',
    href: {
      pathname:
        '/private/manage-nonprofit/[organizationSlug]/donations/[packageId]/',
      query: { organizationSlug, packageId },
    },
    ...props,
  });
