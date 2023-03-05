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

export type CreateAccountParams = CancelTokenParams & {
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTermsOfUse: boolean;
};
export async function createAccount({
  email,
  password,
  confirmPassword,
  agreedToTermsOfUse,
  cancelToken = null,
}: CreateAccountParams) {
  return axios.post(
    encodeURI(`${API_ROOT}/api/users/register/`),
    {
      email,
      password,
      confirm_password: confirmPassword,
      agreed_to_terms_of_use: agreedToTermsOfUse,
    },
    { cancelToken: cancelToken?.token }
  );
}

export type RequestPasswordResetParams = CancelTokenParams & {
  email: string;
};
export async function requestPasswordReset({
  email,
  cancelToken = null,
}: RequestPasswordResetParams) {
  return axios.post(
    encodeURI(`${API_ROOT}/api/users/reset_password/`),
    { email },
    { cancelToken: cancelToken?.token }
  );
}

export type CheckPasswordResetTokenParams = CancelTokenParams & {
  uid: string;
  token: string;
};
export async function checkPasswordResetToken({
  uid,
  token,
  cancelToken = null,
}: CheckPasswordResetTokenParams) {
  return axios.post(
    encodeURI(`${API_ROOT}/api/users/check_reset_password_token/`),
    {
      uid,
      token,
    },
    { cancelToken: cancelToken?.token }
  );
}

export type ConfirmPasswordResetParams = CancelTokenParams & {
  newPassword: string;
  confirmPassword: string;
  uid: string;
  token: string;
};
export async function confirmPasswordReset({
  newPassword,
  confirmPassword,
  uid,
  token,
  cancelToken = null,
}: ConfirmPasswordResetParams) {
  return axios.post(
    encodeURI(`${API_ROOT}/api/users/confirm_reset_password/`),
    {
      new_password: newPassword,
      confirm_password: confirmPassword,
      uid,
      token,
    },
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

function flattenProfileResponse(data) {
  return {
    email: data.user.email,
    firstName: data.user.first_name,
    lastName: data.user.last_name,
    phoneNumber: data.phone_number,
    nonprofitAdmin: data.nonprofit_admin,
  };
}

export async function fetchProfile({
  cancelToken = null,
}: CancelTokenParams = {}) {
  const response = await axios.get(
    encodeURI(`${API_ROOT}/api/private/users/profile/`),
    {
      cancelToken: cancelToken?.token,
    }
  );
  response.data = flattenProfileResponse(response.data);
  return response;
}

type UpdateProfileParams = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
} & CancelTokenParams;
export async function updateProfile({
  firstName,
  lastName,
  phoneNumber,
  cancelToken = null,
}: UpdateProfileParams) {
  const response = await axios.put(
    encodeURI(`${API_ROOT}/api/private/users/profile/`),
    {
      user: { first_name: firstName, last_name: lastName },
      phone_number: phoneNumber,
    },
    {
      cancelToken: cancelToken?.token,
    }
  );
  response.data = flattenProfileResponse(response.data);
  return response;
}

type UpdateProfilePasswordParams = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
} & CancelTokenParams;
export async function updateProfilePassword({
  oldPassword,
  newPassword,
  confirmPassword,
  cancelToken = null,
}: UpdateProfilePasswordParams) {
  return axios.put(
    encodeURI(`${API_ROOT}/api/private/users/change_password/`),
    {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    },
    { cancelToken: cancelToken?.token }
  );
}
