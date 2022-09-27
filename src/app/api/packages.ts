import axios from 'axios';
import { API_ROOT } from 'app/constants';
import type {
  OrganizationSlugParams,
  Package,
  PackageItem,
} from 'app/api/types';

export type CreatePackageParams = OrganizationSlugParams & {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  deliveryCompany: string;
  trackingCode: string;
  note?: string;
  photo?: File;
  items: PackageItem[];
};
export function createPackage({
  organizationSlug,
  firstName,
  lastName,
  email,
  phoneNumber,
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
      first_name: firstName,
      last_name: lastName,
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
