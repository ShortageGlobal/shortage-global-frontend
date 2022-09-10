import styles from './breadcrumbs.module.scss';
import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';

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

export const getOrganizationCrumb = ({
  organizationSlug,
  organizationName,
  ...props
}: {
  organizationSlug: string;
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
  organizationSlug: string;
} & BreadcrumbItem) =>
  Object.freeze({
    ...defaultCrumb,
    label: 'Package Registration',
    href: {
      pathname: '/organizations/[organizationSlug]/package-registration',
      query: { organizationSlug },
    },
    ...props,
  });

export const getProductCrumb = ({
  organizationSlug,
  productSlug,
  productName,
  ...props
}: {
  organizationSlug: string;
  productSlug: string;
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
