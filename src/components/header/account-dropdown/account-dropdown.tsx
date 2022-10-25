import { forwardRef, useCallback } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { User } from 'react-feather';
import { signIn, signOut, useSession } from 'next-auth/react';
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

  const handleSignIn = useCallback(() => {
    signIn();
  }, [signIn]);

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
        {session?.status === 'authenticated' ? (
          <>
            <Dropdown.Header>{session.data.user.email}</Dropdown.Header>
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </>
        ) : (
          <>
            <Dropdown.Item onClick={handleSignIn}>Sign in</Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
