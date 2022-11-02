import axios from 'axios';
import { signOut } from 'next-auth/react';
import { IS_BROWSER } from 'core/constants';

// sign out on 401 (Unauthorized)
if (IS_BROWSER) {
  axios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      return response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger

      // sign out on failed attempt to access protected API
      if (error?.response?.status === 401) {
        signOut();
      }

      return Promise.reject(error);
    }
  );
}
