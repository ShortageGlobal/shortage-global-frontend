import axios from 'axios';
import { API_ROOT } from 'app/constants';
import type {
  OrganizationSlugParams,
  PackageType,
  Package,
  PackageItem,
} from 'app/api/types';

export type CreatePackageParams = OrganizationSlugParams & {
  type: PackageType;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  needTaxDeduction: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvinceRegion?: string;
  zip?: string;
  country: string;
  deliveryCompany?: string;
  trackingCode?: string;
  note?: string;
  photo?: File;
  items: PackageItem[];
};
export function createPackage({
  type,
  organizationSlug,
  firstName,
  lastName,
  email,
  phoneNumber,
  needTaxDeduction,
  addressLine1,
  addressLine2,
  city,
  stateProvinceRegion,
  zip,
  country,
  deliveryCompany,
  trackingCode,
  note,
  photo,
  items,
  cancelToken = null,
}: CreatePackageParams) {
  // TODO: use multipart/form-data to upload photo
  // See: https://stackoverflow.com/a/56194505/1065780

  return axios.post<Package>(
    encodeURI(`${API_ROOT}/api/organizations/${organizationSlug}/packages/`),
    {
      type,
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      need_tax_deduction: needTaxDeduction,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state_province_region: stateProvinceRegion,
      zip,
      country,
      delivery_company: deliveryCompany,
      tracking_code: trackingCode,
      note,
      photo,
      items,
    },
    { cancelToken: cancelToken?.token }
  );
}

export type FetchPackageStatusParams = {
  packageId: string;
} & OrganizationSlugParams;
export function fetchPackageStatus({
  organizationSlug,
  packageId,
  cancelToken = null,
}: FetchPackageStatusParams) {
  return axios.get<Package>(
    encodeURI(
      `${API_ROOT}/api/organizations/${organizationSlug}/packages/${packageId}/`
    ),
    { cancelToken: cancelToken?.token }
  );
}
