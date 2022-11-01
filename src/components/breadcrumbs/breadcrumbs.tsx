import styles from './breadcrumbs.module.scss';
import classNames from 'classnames';
import { Home } from 'react-feather';
import Link, { LinkProps } from 'next/link';
import type { Slug, Uuid } from 'core/api/types';
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
                <span>{item.label}</span>
              ) : (
                <Link href={item.href} className={styles.link}>
                  {item.label}
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
    href: '/account/sign-in',
    ...props,
  });

export const getCreateAccountCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'register',
    label: 'Create Account',
    href: '/account/register',
    ...props,
  });

export const getConfirmAccountCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'confirm-account',
    label: 'Confirm Account',
    href: '/account/activate',
    ...props,
  });

export const getForgotPasswordCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'forgot-password',
    label: 'Forgot Password',
    href: '/account/forgot-password',
    ...props,
  });

export const getProfile = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'profile',
    label: 'Profile',
    href: '/private/profile',
    ...props,
  });

export const getPrivacyPolicyCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'privacy-policy',
    label: 'Privacy Policy',
    href: {
      pathname: '/privacy-policy',
    },
    ...props,
  });

export const getAboutUsCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'about-us',
    label: 'About Us',
    href: {
      pathname: '/about-us',
    },
    ...props,
  });

export const getForCorporateCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'for-corporate',
    label: 'For Corporate',
    href: {
      pathname: '/for-corporate',
    },
    ...props,
  });

export const getForNonprofitCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'for-nonprofit',
    label: 'For Nonprofit',
    href: {
      pathname: '/for-nonprofit',
    },
    ...props,
  });

export const getDonationDetailsCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'donation-details',
    label: 'Donation Details',
    href: {
      pathname: '/donation/details',
    },
    ...props,
  });

export const getDonationCartCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'donation-cart',
    label: 'Donation Cart',
    href: {
      pathname: '/donation/details/cart',
    },
    ...props,
  });

export const getOrganizationCrumb = ({
  organizationSlug,
  organizationName,
  ...props
}: {
  organizationSlug: Slug;
  organizationName: string;
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'organization-crumb',
    label: organizationName,
    href: {
      pathname: '/organizations/[organizationSlug]',
      query: { organizationSlug },
    },
    ...props,
  });

export const getPackageRegistrationCrumb = ({
  organizationSlug,
  ...props
}: {
  organizationSlug: Slug;
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'package-registration',
    label: 'Package Registration',
    href: {
      pathname: '/organizations/[organizationSlug]/packages',
      query: { organizationSlug },
    },
    ...props,
  });

export const getPackageStatusCrumb = ({
  organizationSlug,
  packageId,
  ...props
}: {
  organizationSlug: Slug;
  packageId: Uuid;
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'package-status',
    label: 'Package Status',
    href: {
      pathname: '/organizations/[organizationSlug]/packages/[packageId]',
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
  organizationSlug: Slug;
  productSlug: Slug;
  productName: string;
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    key: 'product-crumb',
    label: productName,
    href: {
      pathname: '/organizations/[organizationSlug]/products/[productSlug]',
      query: { organizationSlug, productSlug },
    },
    ...props,
  });
