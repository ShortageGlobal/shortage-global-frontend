import styles from './authentication.module.scss';
import { useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { Lock } from 'react-feather';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import type { Session } from 'next-auth';

type AuthenticationProps = {
  children: ReactNode;
};

/*
 * Check if user is authenticated before rendering private content.
 * Sign out if session got errors (e.g. refresh token expired).
 */
export function Authentication({ children }: AuthenticationProps) {
  const session = useSession();
  const router = useRouter();

  // sign out if session.data.error is present
  useEffect(() => {
    if ((session?.data as Session & { error?: string })?.error) {
      signOut();
    }
  }, [session]);

  // click on the "Sign in" button
  const handleSignIn = useCallback(() => {
    router.push({
      pathname: '/account/sign-in',
      query: {
        callbackUrl: router.asPath,
      },
    });
  }, [router]);

  // show content if user is authenticated or page is public
  if (
    session?.status === 'authenticated' ||
    !router.pathname.startsWith('/private')
  ) {
    return <>{children}</>;
  }

  // hide private content if user is not authenticated
  if (session?.status === 'unauthenticated') {
    return (
      <div className={styles.authentication}>
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
