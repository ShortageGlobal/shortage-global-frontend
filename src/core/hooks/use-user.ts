import { useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { isRequestCancel, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  selectUser,
  setIsAccessTokenSet as setIsAccessTokenSetAction,
  setIsProfileLoading as setIsProfileLoadingAction,
  setProfile as setProfileAction,
} from 'core/store/slices/user';
import { fetchProfile as fetchProfileAxios } from 'core/api';
import type { CancelTokenParams } from 'core/api/types';

export function useUser() {
  const session = useSession();
  const dispatch = useAppDispatch();

  const { profile, isAccessTokenSet, isProfileLoading } =
    useAppSelector(selectUser);

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

  const setIsAccessTokenSet = useCallback((value: boolean) => {
    dispatch(setIsAccessTokenSetAction(value));
  }, []);

  // fetch profile and store it in redux
  const fetchAndStoreProfile = useCallback(
    async ({ cancelToken }: CancelTokenParams = {}) => {
      dispatch(setIsProfileLoadingAction(true));

      try {
        const response = await fetchProfileAxios({ cancelToken });
        dispatch(setProfileAction(response.data));
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        dispatch(setIsProfileLoadingAction(false));
      }
    },
    []
  );

  const storeProfile = useCallback((newProfile) => {
    dispatch(setProfileAction(newProfile));
  }, []);

  return useMemo(() => {
    return {
      isAccessTokenSet,
      isAuthenticated,
      isUnauthenticated,
      isSessionLoading,
      isProfileLoading,
      isProfileReady,
      profile,
      setIsAccessTokenSet,
      fetchAndStoreProfile,
      storeProfile,
    };
  }, [
    isAccessTokenSet,
    isAuthenticated,
    isUnauthenticated,
    isSessionLoading,
    isProfileLoading,
    isProfileReady,
    profile,
    setIsAccessTokenSet,
    fetchAndStoreProfile,
    storeProfile,
  ]);
}
