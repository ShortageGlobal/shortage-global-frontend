import { AxiosSerializedError } from './api/types';

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
  return isNaN(value) || value === null
    ? value
    : Number(parseFloat(value).toFixed(2)).toLocaleString('en', {
        minimumFractionDigits: 2,
      });
}

// remove http:// or https:// from URL address
export function stripProtocolFromUrl(url: string) {
  return url.replace(/^https?:\/\//, '');
}
