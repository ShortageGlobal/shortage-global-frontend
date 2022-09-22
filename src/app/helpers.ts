import type { AxiosSerializedError, Slug, CartItem } from 'app/api/types';

// format axios error so it could be stored in redux state
export function serizalizeAxiosError(rejection): AxiosSerializedError {
  return {
    code: rejection.code,
    message: rejection.message,
    status: rejection.response?.status || null,
    statusText: rejection.response?.statusText || null,
    data: rejection.response?.data || null,
    headers: rejection.response?.headers || null,
  };
}

// show price value as 1,234,567.89 if possible
export function formatPrice(value) {
  if (isNaN(value) || value === null) {
    return value;
  }
  const formattedPrice = Number(parseFloat(value).toFixed(2)).toLocaleString(
    'en',
    { minimumFractionDigits: 2 }
  );
  return `$${formattedPrice}`;
}

// remove http:// or https:// from URL address
export function stripProtocolFromUrl(url: string) {
  return url.replace(/^https?:\/\//, '');
}

// group a cart items list by organization
type CartGroup = {
  organizationName: string;
  organizationSlug: Slug;
  items: CartItem[];
};
export function groupCartItemsByOrganization({ items }: { items: CartItem[] }) {
  if (!items?.length) {
    return new Map<Slug, CartGroup>();
  }
  return [...items]
    .sort((a, b) => {
      if (b.created_at > a.created_at) {
        return 1;
      }
      return -1;
    })
    .reduce((groups, item) => {
      const organizationSlug = item.product.organization.slug;
      const organizationName = item.product.organization.name;
      if (!groups.has(organizationSlug)) {
        groups.set(organizationSlug, {
          organizationSlug,
          organizationName,
          items: [item],
        });
      } else {
        groups.get(organizationSlug).items.push(item);
      }
      return groups;
    }, new Map<Slug, CartGroup>());
}
