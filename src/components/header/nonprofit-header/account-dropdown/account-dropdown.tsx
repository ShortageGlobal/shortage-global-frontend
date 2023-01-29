import styles from './account-dropdown.module.scss';
import { forwardRef, useState, useCallback } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { User } from 'react-feather';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useUser } from 'core/hooks';
import { getFullNameOrEmail } from 'core/helpers';
import { LoadingMessage } from 'components/loading-message/loading-message';
import { DonorProfileBenefits } from 'components/donor-profile-benefits/donor-profile-benefits';
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
      aria-label="Toggle account menu"
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    isAuthenticated,
    isUnauthenticated,
    isSessionLoading,
    isProfileReady,
    profile,
  } = useUser();

  const handleToggleDropdown = useCallback((nextShow: boolean) => {
    setIsDropdownOpen(nextShow);
  }, []);

  const handleSignIn = useCallback(() => {
    handleToggleDropdown(false);
    router.push({
      pathname: '/account/sign-in/',
      query: {
        callbackUrl: router.asPath,
      },
    });
  }, [router, handleToggleDropdown]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  return (
    <Dropdown onToggle={handleToggleDropdown} show={isDropdownOpen}>
      <Dropdown.Toggle
        as={AccountMenuToggler}
        toggleClassName={toggleClassName}
      >
        <User />
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        {isSessionLoading ? (
          <LoadingMessage className={styles.loadingItem} />
        ) : null}

        {isAuthenticated ? (
          <>
            {isProfileReady ? (
              <Dropdown.Header>
                {getFullNameOrEmail({ profile })}
              </Dropdown.Header>
            ) : null}

            {/* <Link href="/private/profile/" passHref legacyBehavior>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link> */}

            <Dropdown.Divider />

            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </>
        ) : null}

        {isUnauthenticated ? (
          <>
            <div className={styles.customMenu}>
              <DonorProfileBenefits className={styles.donorProfileBenefits} />

              <div className={styles.actions}>
                <Link href="/account/create-account/" passHref legacyBehavior>
                  <Button
                    disabled={router.pathname.startsWith(
                      '/account/create-account'
                    )}
                    onClick={() => handleToggleDropdown(false)}
                  >
                    Register as a donor
                  </Button>
                </Link>

                <Button
                  onClick={handleSignIn}
                  disabled={router.pathname.startsWith('/account/sign-in')}
                >
                  Sign in
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </Dropdown.Menu>
    </Dropdown>
  );
}
