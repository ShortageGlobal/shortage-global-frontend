import axios from 'axios';
import { API_ROOT, DEMO_REQUEST_SOURCE } from 'core/constants';
import type { CancelTokenParams } from 'core/api/types';

export type DemoRequestParams = CancelTokenParams & {
  email: string;
  source: DEMO_REQUEST_SOURCE;
};
export function demoRequest({
  email,
  source,
  cancelToken = null,
}: DemoRequestParams) {
  return axios.post(
    encodeURI(`${API_ROOT}/api/demo-request/`),
    { email, source },
    { cancelToken: cancelToken?.token }
  );
}
