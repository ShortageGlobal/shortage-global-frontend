import styles from './manage-nonprofit-nav.module.scss';
import { useMemo } from 'react';
import { Nav } from 'react-bootstrap';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppSelector } from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import { MANAGE_NONPROFIT_TOUR_ID } from 'core/constants';

const KEY = Object.freeze({
  page: 'page',
  requestedGoods: 'requestedGoods',
  campaigns: 'campaigns',
  deliveryInstruction: 'deliveryInstruction',
  taxDeduction: 'taxDeduction',
  donations: 'donations',
  impactStories: 'impactStories',
  profile: 'profile',
  changePassword: 'changePassword',
});

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

    // campaigns list/create/edit
    if (
      router.pathname.startsWith(
        '/private/manage-nonprofit/[organizationSlug]/campaigns'
      )
    ) {
      return KEY.campaigns;
    }

    // packages list/details
    if (
      router.pathname.startsWith(
        '/private/manage-nonprofit/[organizationSlug]/donations'
      )
    ) {
      return KEY.donations;
    }

    // Impact Stories list/details
    if (
      router.pathname.startsWith(
        '/private/manage-nonprofit/[organizationSlug]/impact-stories'
      )
    ) {
      return KEY.impactStories;
    }

    // the rest of routes
    switch (router.pathname) {
      case '/private/manage-nonprofit/[organizationSlug]/page': {
        return KEY.page;
      }
      case '/private/manage-nonprofit/[organizationSlug]/delivery-instruction': {
        return KEY.deliveryInstruction;
      }
      case '/private/manage-nonprofit/[organizationSlug]/tax-information': {
        return KEY.taxDeduction;
      }
      case '/private/manage-nonprofit/[organizationSlug]/profile': {
        return KEY.profile;
      }
      case '/private/manage-nonprofit/[organizationSlug]/change-password': {
        return KEY.changePassword;
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
      id={MANAGE_NONPROFIT_TOUR_ID.NAV_PANEL}
    >
      <Nav.Link
        as={Link}
        eventKey={KEY.page}
        href={`/private/manage-nonprofit/${organization.slug}/page/`}
        id={MANAGE_NONPROFIT_TOUR_ID.NONPROFIT_PAGE_NAV}
      >
        Nonprofit Page
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.requestedGoods}
        href={`/private/manage-nonprofit/${organization.slug}/requested-goods/`}
        id={MANAGE_NONPROFIT_TOUR_ID.REQUESTED_GOODS_NAV}
      >
        Requested Goods
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.campaigns}
        href={`/private/manage-nonprofit/${organization.slug}/campaigns/`}
        id={MANAGE_NONPROFIT_TOUR_ID.CAMPAIGNS_NAV}
      >
        Campaigns
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.deliveryInstruction}
        href={`/private/manage-nonprofit/${organization.slug}/delivery-instruction/`}
        id={MANAGE_NONPROFIT_TOUR_ID.DELIVERY_INSTRUCTIONS_NAV}
      >
        Delivery Instruction
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.taxDeduction}
        href={`/private/manage-nonprofit/${organization.slug}/tax-information/`}
        id={MANAGE_NONPROFIT_TOUR_ID.TAX_INFORMATION_NAV}
      >
        Tax Information
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.donations}
        href={`/private/manage-nonprofit/${organization.slug}/donations/`}
        id={MANAGE_NONPROFIT_TOUR_ID.DONATIONS_NAV}
      >
        Donations
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.impactStories}
        href={`/private/manage-nonprofit/${organization.slug}/impact-stories/`}
        id={MANAGE_NONPROFIT_TOUR_ID.IMPACT_STORIES_NAV}
      >
        Impact Stories
      </Nav.Link>

      <div className={styles.divider} />

      <Nav.Link
        as={Link}
        eventKey={KEY.profile}
        href={`/private/manage-nonprofit/${organization.slug}/profile/`}
      >
        Profile
      </Nav.Link>
      <Nav.Link
        as={Link}
        eventKey={KEY.changePassword}
        href={`/private/manage-nonprofit/${organization.slug}/change-password/`}
      >
        Change Password
      </Nav.Link>
    </Nav>
  );
}
