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
  taxDeduction: 'taxDeduction',
  deliveryInstruction: 'deliveryInstruction',
};

export function ManageNonprofitNav() {
  const router = useRouter();
  const { organization } = useAppSelector(selectAccountOrganization);

  const activeKey = useMemo(() => {
    switch (router.pathname) {
      case '/private/manage-nonprofit/[organizationSlug]/page': {
        return KEY.page;
      }
      case '/private/manage-nonprofit/[organizationSlug]/tax-deduction': {
        return KEY.taxDeduction;
      }
      case '/private/manage-nonprofit/[organizationSlug]/delivery-instruction': {
        return KEY.deliveryInstruction;
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
        eventKey={KEY.taxDeduction}
        href={`/private/manage-nonprofit/${organization.slug}/tax-deduction/`}
      >
        Tax Deduction
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.deliveryInstruction}
        href={`/private/manage-nonprofit/${organization.slug}/delivery-instruction/`}
      >
        Delivery Instruction
      </Nav.Link>
    </Nav>
  );
}
