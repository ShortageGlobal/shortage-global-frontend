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

export async function fetchProfile({
  cancelToken = null,
}: CancelTokenParams = {}) {
  return axios.get(encodeURI(`/api/private/users/profile/`), {
    cancelToken: cancelToken?.token,
  });
}

export type CreateAccountParams = CancelTokenParams & {
  email: string;
  password: string;
  confirmPassword: string;
};
export async function createAccount({
  email,
  password,
  confirmPassword,
  cancelToken = null,
}: CreateAccountParams) {
  return axios.post(
    encodeURI(`${API_ROOT}/api/users/register/`),
    { email, password, confirm_password: confirmPassword },
    { cancelToken: cancelToken?.token }
  );
}

export type ConfirmAccountParams = CancelTokenParams & {
  uid: string;
  token: string;
};
export async function confirmAccount({
  uid,
  token,
  cancelToken = null,
}: ConfirmAccountParams) {
  return axios.post(
    encodeURI(`${API_ROOT}/api/users/activate/`),
    { uid, token },
    { cancelToken: cancelToken?.token }
  );
}
