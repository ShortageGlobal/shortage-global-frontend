import { forwardRef, useCallback } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { User } from 'react-feather';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
  const session = useSession();
  const router = useRouter();

  const handleSignIn = useCallback(() => {
    router.push({
      pathname: '/account/sign-in',
      query: {
        callbackUrl: router.asPath,
      },
    });
  }, [router]);

  const handleSignOut = useCallback(() => {
    signOut({ redirect: false });
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
        {session?.status === 'authenticated' ? (
          <>
            <Dropdown.Header>{session.data.user.email}</Dropdown.Header>
            <Link href="/private/profile" passHref legacyBehavior>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </>
        ) : (
          <>
            <Dropdown.Item
              onClick={handleSignIn}
              disabled={router.pathname.startsWith('/account/sign-in')}
              as="button"
            >
              Sign in
            </Dropdown.Item>
            <Link href="/account/create-account" passHref legacyBehavior>
              <Dropdown.Item
                disabled={router.pathname.startsWith('/account/create-account')}
              >
                Create account
              </Dropdown.Item>
            </Link>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
