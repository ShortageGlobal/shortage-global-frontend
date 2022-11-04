import styles from './account-nav.module.scss';
import { useMemo } from 'react';
import { Nav } from 'react-bootstrap';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';

const KEY = {
  profile: 'profile',
  donations: 'donations',
};

export function AccountNav() {
  const router = useRouter();

  const activeKey = useMemo(() => {
    switch (router.pathname) {
      case '/private/profile': {
        return KEY.profile;
      }
      case '/private/donations': {
        return KEY.donations;
      }
      default: {
        return null;
      }
    }
  }, [router.pathname]);

  return (
    <Nav
      className={classNames('flex-row flex-md-column', styles.accountNav)}
      activeKey={activeKey}
    >
      <Nav.Link as={Link} eventKey={KEY.profile} href="/private/profile/">
        Profile
      </Nav.Link>
      <Nav.Link as={Link} eventKey={KEY.donations} href="/private/donations/">
        Donations
      </Nav.Link>
    </Nav>
  );
}
