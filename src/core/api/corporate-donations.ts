import axios from 'axios';
import { API_ROOT } from 'core/constants';
import type { CancelTokenParams } from 'core/api/types';

export type RegisterCorporateDonationParams = CancelTokenParams & {
  companyName: string;
  department?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvinceRegion?: string;
  zip?: string;
  country: string;
  description?: string;
  quantityDescription?: string;
  numberOfPallets?: string;
  estimatedValue?: string;
  url?: string;
  photo?: File;
  agreedToTermsOfUse: Boolean;
};
export function registerCorporateDonation({
  companyName,
  department,
  firstName,
  lastName,
  phoneNumber,
  email,
  addressLine1,
  addressLine2,
  city,
  stateProvinceRegion,
  zip,
  country,
  description,
  quantityDescription,
  numberOfPallets,
  estimatedValue,
  url,
  photo,
  agreedToTermsOfUse,
  cancelToken = null,
}: RegisterCorporateDonationParams) {
  return axios.post(
    encodeURI(`${API_ROOT}/api/corporate-donations/`),
    {
      company_name: companyName,
      department,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state_province_region: stateProvinceRegion,
      zip,
      country,
      description,
      quantity_description: quantityDescription,
      number_of_pallets: numberOfPallets,
      estimated_value: estimatedValue,
      url,
      photo,
      agreed_to_terms_of_use: agreedToTermsOfUse,
    },
    { cancelToken: cancelToken?.token }
  );
}

export type FetchCorporateDonationOptionsParams = CancelTokenParams;
export function fetchCorporateDonationOptions({
  cancelToken = null,
}: FetchCorporateDonationOptionsParams = {}) {
  return axios.options(encodeURI(`${API_ROOT}/api/corporate-donations/`), {
    cancelToken: cancelToken?.token,
  });
}
