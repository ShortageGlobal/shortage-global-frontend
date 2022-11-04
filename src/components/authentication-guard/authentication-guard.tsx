import styles from './authentication-guard.module.scss';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { Lock } from 'react-feather';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useUser } from 'core/hooks';
import type { ReactNode } from 'react';
import type { Session } from 'next-auth';

type AuthenticationGuardProps = {
  children: ReactNode;
};

/*
 * Check if user is authenticated before rendering private content.
 * Sign out if session got errors (e.g. refresh token expired).
 */
export function AuthenticationGuard({ children }: AuthenticationGuardProps) {
  const session = useSession();
  const router = useRouter();

  const { isAuthenticated, isUnauthenticated, fetchAndStoreProfile } =
    useUser();

  const [isAccessTokenSet, setIsAccessTokenSet] = useState(false);

  // fetch profile data if user is authenticated
  useEffect(() => {
    if (isAuthenticated && isAccessTokenSet) {
      fetchAndStoreProfile();
    }
  }, [isAuthenticated, isAccessTokenSet]);

  // set accessToken as Authorization header
  const accessToken = (session?.data as Session & { accessToken?: string })
    ?.accessToken;
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setIsAccessTokenSet(true);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setIsAccessTokenSet(false);
    }
  }, [accessToken]);

  // sign out if session.data.error is present
  const sessionError = (session?.data as Session & { error?: string })?.error;
  useEffect(() => {
    if (sessionError) {
      signOut();
    }
  }, [sessionError]);

  // click on the "Sign in" button
  const handleSignIn = useCallback(() => {
    router.push({
      pathname: '/account/sign-in/',
      query: {
        callbackUrl: router.asPath,
      },
    });
  }, [router]);

  // show content if user is authenticated or page is public
  if (
    (isAuthenticated && isAccessTokenSet) ||
    !router.pathname.startsWith('/private')
  ) {
    return <>{children}</>;
  }

  // hide private content if user is not authenticated
  if (isUnauthenticated) {
    return (
      <div className={styles.authenticationGuard}>
        <Lock size="3rem" />

        <div className={styles.message}>
          <span>You must be signed in to view this page</span>
        </div>

        <Button variant="outline-dark" onClick={handleSignIn}>
          Sign in
        </Button>
      </div>
    );
  }

  // show nothing while we are waiting for session
  return null;
}
