import styles from './account-dropdown.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { forwardRef, useCallback } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { User, Loader } from 'react-feather';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useUser } from 'core/hooks';
import { getFullNameOrEmail } from 'core/helpers';
import type { MouseEvent, ReactNode } from 'react';

type AccountMenuTogglerProps = {
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  toggleClassName: string;
};

const AccountMenuToggler = forwardRef<
  HTMLButtonElement,
  AccountMenuTogglerProps
>(({ children, onClick, toggleClassName }, ref) => {
  return (
    <Button
      ref={ref}
      variant=""
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className={toggleClassName}
    >
      {children}
    </Button>
  );
});
AccountMenuToggler.displayName = 'AccountMenuToggler';

type AccountDropdownProps = {
  toggleClassName: string;
};

export function AccountDropdown({ toggleClassName }: AccountDropdownProps) {
  const router = useRouter();

  const {
    isAuthenticated,
    isUnauthenticated,
    isSessionLoading,
    isProfileReady,
    profile,
  } = useUser();

  const handleSignIn = useCallback(() => {
    router.push({
      pathname: '/account/sign-in/',
      query: {
        callbackUrl: router.asPath,
      },
    });
  }, [router]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  return (
    <Dropdown>
      <Dropdown.Toggle
        as={AccountMenuToggler}
        toggleClassName={toggleClassName}
      >
        <User />
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        {isSessionLoading ? (
          <div className={styles.loadingItem}>
            <Loader
              role="status"
              aria-hidden="true"
              className={animationStyles.rotate}
            />
            <span>Loading...</span>
          </div>
        ) : null}

        {isAuthenticated ? (
          <>
            {isProfileReady ? (
              <Dropdown.Header>
                {getFullNameOrEmail({ profile })}
              </Dropdown.Header>
            ) : null}

            <Link href="/private/profile/" passHref legacyBehavior>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>

            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </>
        ) : null}

        {isUnauthenticated ? (
          <>
            <Dropdown.Item
              onClick={handleSignIn}
              disabled={router.pathname.startsWith('/account/sign-in')}
              as="button"
            >
              Sign in
            </Dropdown.Item>

            <Link href="/account/create-account/" passHref legacyBehavior>
              <Dropdown.Item
                disabled={router.pathname.startsWith('/account/create-account')}
              >
                Create account
              </Dropdown.Item>
            </Link>
          </>
        ) : null}
      </Dropdown.Menu>
    </Dropdown>
  );
}
