import axios from 'axios';
import { API_ROOT } from 'core/constants';
import { JWTToken, CancelTokenParams } from 'core/api/types';

export type RequestAccessTokenParams = CancelTokenParams & {
  email: string;
  password: string;
};
export async function requestAccessToken({
  email,
  password,
  cancelToken = null,
}: RequestAccessTokenParams) {
  return axios.post<{ access: JWTToken; refresh: JWTToken }>(
    encodeURI(`${API_ROOT}/api/token/`),
    { email, password },
    { cancelToken: cancelToken?.token }
  );
}

export type RefreshAccessTokenParams = CancelTokenParams & {
  refresh: JWTToken;
};
export async function refreshAccessToken({
  refresh,
  cancelToken = null,
}: RefreshAccessTokenParams) {
  return axios.post<{ access: JWTToken }>(
    encodeURI(`${API_ROOT}/api/token/refresh/`),
    { refresh },
    { cancelToken: cancelToken?.token }
  );
}
