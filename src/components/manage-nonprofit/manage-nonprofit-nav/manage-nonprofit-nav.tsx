import styles from './manage-nonprofit-nav.module.scss';
import { useMemo } from 'react';
import { Nav } from 'react-bootstrap';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useAppSelector } from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import Link from 'next/link';

const KEY = {
  details: 'details',
  page: 'page',
};

export function ManageNonprofitNav() {
  const router = useRouter();
  const { organization } = useAppSelector(selectAccountOrganization);

  const activeKey = useMemo(() => {
    switch (router.pathname) {
      case '/private/manage-nonprofit/[organizationSlug]/details': {
        return KEY.details;
      }
      case '/private/manage-nonprofit/[organizationSlug]/page': {
        return KEY.page;
      }
      default: {
        return null;
      }
    }
  }, [router.pathname]);

  return (
    <Nav
      className={classNames(
        'flex-row flex-md-column',
        styles.manageNonprofitNav
      )}
      activeKey={activeKey}
    >
      <Nav.Link
        as={Link}
        eventKey={KEY.details}
        href={`/private/manage-nonprofit/${organization.slug}/details/`}
      >
        Details
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.page}
        href={`/private/manage-nonprofit/${organization.slug}/page/`}
      >
        Nonprofit Page
      </Nav.Link>
    </Nav>
  );
}
