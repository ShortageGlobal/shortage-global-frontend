import axios from 'axios';
import { API_ROOT } from 'core/constants';
import type { CancelTokenParams } from 'core/api/types';

export type RegisterNonprofitParams = CancelTokenParams & {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  organizationName?: string;
  url?: string;
  einNumber?: string;
  agreedToTermsOfUse: boolean;
};
export function registerNonprofit({
  firstName,
  lastName,
  email,
  phoneNumber,
  organizationName,
  url,
  einNumber,
  agreedToTermsOfUse,
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
      agreed_to_terms_of_use: agreedToTermsOfUse,
    },
    { cancelToken: cancelToken?.token }
  );
}
