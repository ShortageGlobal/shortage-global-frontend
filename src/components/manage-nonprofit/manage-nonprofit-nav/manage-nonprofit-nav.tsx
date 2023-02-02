import styles from './manage-nonprofit-nav.module.scss';
import { useMemo } from 'react';
import { Nav } from 'react-bootstrap';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';

const KEY = {
  profile: 'profile',
  donations: 'donations',
  myImpact: 'myImpact',
  changePassword: 'changePassword',
};

export function ManageNonprofitNav() {
  const router = useRouter();

  const activeKey = useMemo(() => {
    switch (router.pathname) {
      case '/private/profile': {
        return KEY.profile;
      }
      case '/private/donations':
      case '/private/donations/[packageId]': {
        return KEY.donations;
      }
      case '/private/my-impact': {
        return KEY.myImpact;
      }
      case '/private/change-password': {
        return KEY.changePassword;
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
      <Nav.Link as={Link} eventKey={KEY.myImpact} href="/private/my-impact/">
        My Impact
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.changePassword}
        href="/private/change-password/"
      >
        Change Password
      </Nav.Link>
    </Nav>
  );
}
