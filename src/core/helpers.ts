import { getToken } from 'next-auth/jwt';
import type { GetTokenParams } from 'next-auth/jwt';
import type {
  AxiosSerializedError,
  Slug,
  CartItem,
  Profile,
} from 'core/api/types';
import type { ReactNode } from 'react';

// format axios error so it could be stored in redux state
export function serizalizeAxiosError(rejection): AxiosSerializedError {
  return {
    code: rejection.code,
    message: rejection.message,
    status: rejection.response?.status || null,
    statusText: rejection.response?.statusText || null,
    data: rejection.response?.data || null,
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
export type CartGroup = {
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

// Extract backend JWT token from session. Works server-side only
export async function extractAccessTokenFromSession<R extends boolean = false>(
  params: GetTokenParams<R>
) {
  const token = await getToken({ req: params.req });
  const accessToken = (token?.account as { accessToken?: string })?.accessToken;
  return accessToken;
}

export function getFullNameOrEmail({ profile }: { profile: Profile }) {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  return fullName ? fullName : profile.email;
}

// get the number of days/hours/minutes/seconds between now and provided date
export function timeCountdown({ date }: { date: Date | string | number }) {
  const future = Number(new Date(date));
  const now = Date.now();
  const diff = future - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor(diff / (1000 * 60));
  const secs = Math.floor(diff / 1000);

  const d = days;
  const h = hours - days * 24;
  const m = mins - hours * 60;
  const s = secs - mins * 60;

  return {
    days: d,
    hours: h,
    minutes: m,
    seconds: s,
  };
}

// get singular or plural label based on value
export function pluralize(
  value: number,
  singular: string | ReactNode,
  plural: ReactNode
) {
  if (value === 1) {
    return singular;
  }
  return plural;
}

// get unique product identifier based on the organization slug and product slug
export function getProductId({ organizationSlug, productSlug }) {
  return `${organizationSlug} / ${productSlug}`;
}

// Return format: "December 14, 2022"
export function formatDateForHumans({
  date,
  isMonthShort = false, // "Dec" or "December"
}: {
  date: Date | string;
  isMonthShort?: boolean;
}) {
  return new Date(date).toLocaleString('en-us', {
    month: isMonthShort ? 'short' : 'long',
    year: 'numeric',
    day: 'numeric',
  });
}
