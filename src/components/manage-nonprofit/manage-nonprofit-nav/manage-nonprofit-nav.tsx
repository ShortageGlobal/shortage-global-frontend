import styles from './manage-nonprofit-nav.module.scss';
import { useMemo } from 'react';
import { Nav } from 'react-bootstrap';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useAppSelector } from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import Link from 'next/link';

const KEY = {
  page: 'page',
  requestedGoods: 'requestedGoods',
  deliveryInstruction: 'deliveryInstruction',
  taxDeduction: 'taxDeduction',
};

export function ManageNonprofitNav() {
  const router = useRouter();
  const { organization } = useAppSelector(selectAccountOrganization);

  const activeKey = useMemo(() => {
    // requested goods list/create/edit
    if (
      router.pathname.startsWith(
        '/private/manage-nonprofit/[organizationSlug]/requested-goods'
      )
    ) {
      return KEY.requestedGoods;
    }

    // the rest of routes
    switch (router.pathname) {
      case '/private/manage-nonprofit/[organizationSlug]/page': {
        return KEY.page;
      }
      case '/private/manage-nonprofit/[organizationSlug]/delivery-instruction': {
        return KEY.deliveryInstruction;
      }
      case '/private/manage-nonprofit/[organizationSlug]/legal-information': {
        return KEY.taxDeduction;
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
        eventKey={KEY.page}
        href={`/private/manage-nonprofit/${organization.slug}/page/`}
      >
        Nonprofit Page
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.requestedGoods}
        href={`/private/manage-nonprofit/${organization.slug}/requested-goods/`}
      >
        Requested Goods
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.deliveryInstruction}
        href={`/private/manage-nonprofit/${organization.slug}/delivery-instruction/`}
      >
        Delivery Instruction
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.taxDeduction}
        href={`/private/manage-nonprofit/${organization.slug}/legal-information/`}
      >
        Legal Information
      </Nav.Link>
    </Nav>
  );
}
