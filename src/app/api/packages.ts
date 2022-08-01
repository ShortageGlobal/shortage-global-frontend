import axios from 'axios';
import { API_ROOT } from 'app/constants';
import type {
  OrganizationSlugParams,
  PackageCreationParams,
  PackageStatusResponse,
} from 'app/api/types';

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
}: PackageCreationParams) {
  return axios.post(
    `${API_ROOT}/api/organizations/${organizationSlug}/packages/`,
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

export function fetchPackageStatus({
  organizationSlug,
  packageId,
  cancelToken = null,
}: { packageId: string } & OrganizationSlugParams) {
  return axios.get<PackageStatusResponse>(
    `${API_ROOT}/api/organizations/${organizationSlug}/packages/${packageId}/`,
    { cancelToken: cancelToken?.token }
  );
}
