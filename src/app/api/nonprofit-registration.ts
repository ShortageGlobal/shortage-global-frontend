import axios from 'axios';
import { API_ROOT } from 'app/constants';
import type { CancelTokenParams } from 'app/api/types';

export type RegisterNonprofitParams = CancelTokenParams & {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  organizationName?: string;
  url?: string;
  einNumber?: string;
};
export function registerNonprofit({
  firstName,
  lastName,
  email,
  phoneNumber,
  organizationName,
  url,
  einNumber,
  cancelToken = null,
}: RegisterNonprofitParams) {
  return axios.post(
    encodeURI(`${API_ROOT}/api/register-nonprofit/`),
    {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      organization_name: organizationName,
      url: url,
      ein_number: einNumber,
    },
    { cancelToken: cancelToken?.token }
  );
}
