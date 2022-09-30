import styles from './breadcrumbs.module.scss';
import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';
import type { Slug, Uuid } from 'app/api/types';

type BreadcrumbItem = {
  label?: string;
  href?: LinkProps['href'];
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
              key={item.label}
              className={classNames('breadcrumb-item text-truncate', {
                active: item.isActive,
              })}
              {...(item.isActive ? { 'aria-current': 'page' } : {})}
            >
              {item.isActive ? (
                <span>{item.label}</span>
              ) : (
                <Link href={item.href}>
                  <a className={styles.link}>{item.label}</a>
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
  label: 'Crumb',
  href: '/',
  isActive: false,
});

export const getHomeCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    label: 'Home',
    href: '/',
    ...props,
  });

export const getHowItWorksCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    label: 'How It Works',
    href: {
      pathname: '/how-it-works',
    },
    ...props,
  });

export const getForCorporateCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    label: 'For Corporate',
    href: {
      pathname: '/for-corporate',
    },
    ...props,
  });

export const getForNonprofitCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    label: 'For Nonprofit',
    href: {
      pathname: '/for-nonprofit',
    },
    ...props,
  });

export const getDonationDetailsCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
    label: 'Donation Details',
    href: {
      pathname: '/donation/details',
    },
    ...props,
  });

export const getDonationCartCrumb = (props: BreadcrumbItem = {}) =>
  Object.freeze({
    ...defaultCrumb,
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
    label: productName,
    href: {
      pathname: '/organizations/[organizationSlug]/products/[productSlug]',
      query: { organizationSlug, productSlug },
    },
    ...props,
  });
