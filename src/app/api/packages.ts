import axios from 'axios';
import { API_ROOT } from 'app/constants';
import type {
  OrganizationSlugParams,
  PackageItem,
  PackageStatus,
} from 'app/api/types';

export type CreatePackageParams = OrganizationSlugParams & {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  deliveryCompany: string;
  trackingCode: string;
  note?: string;
  photo?: string;
  items: PackageItem[];
};
export function createPackage({
  organizationSlug,
  fullName,
  email,
  phoneNumber,
  deliveryCompany,
  trackingCode,
  note,
  photo,
  items,
  cancelToken = null,
}: CreatePackageParams) {
  return axios.post(
    encodeURI(`${API_ROOT}/api/organizations/${organizationSlug}/packages/`),
    {
      full_name: fullName,
      email,
      phone_number: phoneNumber,
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
export type FetchPackageStatusResponse = {
  delivery_company: string;
  tracking_code: string;
  created_at: string;
  status: PackageStatus;
};
export function fetchPackageStatus({
  organizationSlug,
  packageId,
  cancelToken = null,
}: FetchPackageStatusParams) {
  return axios.get<FetchPackageStatusResponse>(
    encodeURI(
      `${API_ROOT}/api/organizations/${organizationSlug}/packages/${packageId}/`
    ),
    { cancelToken: cancelToken?.token }
  );
}
