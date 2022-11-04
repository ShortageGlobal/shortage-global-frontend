import { useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { isRequestCancel, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  selectUser,
  setIsProfileLoading as setIsProfileLoadingAction,
  setProfile as setProfileAction,
} from 'core/store/slices/user';
import { fetchProfile as fetchProfileAxios } from 'core/api';
import type { CancelTokenParams } from 'core/api/types';

export function useUser() {
  const session = useSession();
  const dispatch = useAppDispatch();

  const { profile, isProfileLoading } = useAppSelector(selectUser);

  const isAuthenticated = useMemo(
    () => session?.status === 'authenticated',
    [session?.status]
  );
  const isUnauthenticated = useMemo(
    () => session?.status === 'unauthenticated',
    [session?.status]
  );
  const isSessionLoading = useMemo(
    () => session?.status === 'loading',
    [session?.status]
  );
  const isProfileReady = useMemo(() => !!profile?.email, [profile?.email]);

  // fetch profile and store it in redux
  const fetchAndStoreProfile = useCallback(
    async ({ cancelToken }: CancelTokenParams = {}) => {
      dispatch(setIsProfileLoadingAction(true));

      try {
        const response = await fetchProfileAxios({ cancelToken });
        const profile = {
          email: response.data.user.email,
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
          phoneNumber: response.data.phone_number,
        };
        dispatch(setProfileAction(profile));
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        dispatch(setIsProfileLoadingAction(false));
      }
    },
    []
  );

  return useMemo(() => {
    return {
      isAuthenticated,
      isUnauthenticated,
      isSessionLoading,
      isProfileLoading,
      isProfileReady,
      profile,
      fetchAndStoreProfile,
    };
  }, [
    isAuthenticated,
    isUnauthenticated,
    isSessionLoading,
    isProfileLoading,
    isProfileReady,
    profile,
    fetchAndStoreProfile,
  ]);
}
