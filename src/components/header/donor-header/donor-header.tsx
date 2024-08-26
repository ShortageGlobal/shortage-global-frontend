import styles from 'components/header/header.module.scss';
import donorStyles from 'components/header/donor-header/donor-header.module.scss';
import { useCallback, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Badge,
} from 'react-bootstrap';
import { Menu, X } from 'react-feather';
import classNames from 'classnames';
import { useAppSelector, useScrollPosition } from 'core/hooks';
import { selectSearch } from 'core/store/slices/search';
import { LogoImage } from 'components/logo-image/logo-image';
import { ActiveLink } from 'components/active-link/active-link';
import { SearchProducts } from 'components/header/donor-header/search/search';
import { AccountDropdown } from 'components/header/donor-header/account-dropdown/account-dropdown';
import { CartButton } from 'components/cart/cart-button/cart-button';

export function DonorHeader() {
  const router = useRouter();

  const { searchQuery, isSearchInputFocused } = useAppSelector(selectSearch);

  const [isWindowScrollAtTop, setIsWindowScrollAtTop] = useState(true);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  // track current route
  const { isRootRoute, isOrganizationRoute, isCampaignRoute } = useMemo(() => {
    return {
      isRootRoute: router.route === '/',
      isOrganizationRoute: router.route === '/[organizationSlug]',
      isCampaignRoute:
        router.route ===
        '/[organizationSlug]/campaigns/[campaignSlug]/[campaignUuid]',
    };
  }, [router]);

  // collapse navbar on route change
  useEffect(() => {
    setIsNavbarExpanded(false);
  }, [router.route]);

  // change isWindowScroll based on the scroll position
  useScrollPosition(({ currPos }) => {
    setIsWindowScrollAtTop(currPos.y === 0);
  }, []);

  // control navbar border visibility
  const showNavbarBorder = useMemo(() => {
    return !isRootRoute || !isWindowScrollAtTop || isNavbarExpanded;
  }, [isRootRoute, isWindowScrollAtTop, isNavbarExpanded]);

  // control search field visibility
  const shouldShowSearchField = useMemo(() => {
    return isRootRoute || isOrganizationRoute || isCampaignRoute;
  }, [isRootRoute, isOrganizationRoute, isCampaignRoute]);

  const handleNavbarToggle = useCallback((newIsNavbarExpanded) => {
    setIsNavbarExpanded(newIsNavbarExpanded);
  }, []);

  return (
    <header className={classNames(styles.header, donorStyles.header)}>
      <Navbar
        expand="lg"
        fixed="top"
        expanded={isNavbarExpanded}
        onToggle={handleNavbarToggle}
        className={classNames(styles.navbar, donorStyles.navbar, {
          [donorStyles.navbarWithBorder]: showNavbarBorder,
          [donorStyles.withSearchExpanded]:
            isSearchInputFocused || searchQuery?.length > 0,
        })}
      >
        {/* <GlobalNotification /> */}
        <Container className={styles.container}>
          <Link
            href="/"
            className={classNames(styles.logo, donorStyles.logo)}
            aria-label="Shortage"
          >
            <LogoImage />
          </Link>

          <div
            className={classNames(styles.controlsBar, donorStyles.controlsBar)}
          >
            {shouldShowSearchField ? <SearchProducts /> : null}

            <Button
              variant=""
              className={styles.navbarToggle}
              onClick={() => setIsNavbarExpanded(!isNavbarExpanded)}
              aria-label="Toggle menu"
            >
              {isNavbarExpanded ? <X /> : <Menu />}
            </Button>

            <AccountDropdown
              toggleClassName={styles.headerControlCollapsedNav}
            />

            <CartButton className={styles.headerControlCollapsedNav} />
          </div>

          <Navbar.Collapse
            className={styles.navbarCollapse}
            id="header-navbar-nav"
          >
            <div className={styles.navbarCollapsedTopPlaceholder} />

            <Nav>
              {/* Dropdown with links (wide screen) */}
              <NavDropdown
                title="For Partners"
                className={styles.headerControlExpandedNav}
              >
                <ActiveLink href="/for-individuals/" passHref>
                  <NavDropdown.Item>For Individuals</NavDropdown.Item>
                </ActiveLink>
                <ActiveLink href="/for-nonprofits/" passHref>
                  <NavDropdown.Item>For Nonprofits</NavDropdown.Item>
                </ActiveLink>
                <ActiveLink href="/for-corporate/" passHref>
                  <NavDropdown.Item>For Corporate</NavDropdown.Item>
                </ActiveLink>
              </NavDropdown>

              {/* Shopify Integration (wide screen) */}
              <ActiveLink href="/shopify-integration/" passHref>
                <Nav.Link className={styles.headerControlExpandedNav}>
                  Shopify Integration
                  <Badge bg="primary" className="ms-2">
                    new
                  </Badge>
                </Nav.Link>
              </ActiveLink>

              {/* Links (narrow screen) */}
              <div className={styles.headerControlCollapsedNav}>
                <ActiveLink href="/for-individuals/" passHref>
                  <Nav.Link>For Individuals</Nav.Link>
                </ActiveLink>
                <ActiveLink href="/for-nonprofits/" passHref>
                  <Nav.Link>For Nonprofits</Nav.Link>
                </ActiveLink>
                <ActiveLink href="/for-corporate/" passHref>
                  <Nav.Link>For Corporate</Nav.Link>
                </ActiveLink>
                <ActiveLink href="/shopify-integration/" passHref>
                  <Nav.Link>
                    Shopify Integration
                    <Badge className="ms-2">new</Badge>
                  </Nav.Link>
                </ActiveLink>
              </div>

              {/* <ActiveLink href="/shopify-integration/" passHref>
                <Nav.Link>Shopify Integration</Nav.Link>
              </ActiveLink> */}
            </Nav>
          </Navbar.Collapse>

          <AccountDropdown toggleClassName={styles.headerControlExpandedNav} />

          <CartButton className={styles.headerControlExpandedNav} />
        </Container>
      </Navbar>
    </header>
  );
}
