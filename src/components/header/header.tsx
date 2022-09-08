import styles from './header.module.scss';
import { useCallback, useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Badge,
} from 'react-bootstrap';
import { User, Package } from 'react-feather';
import { useAppDispatch, useAppSelector, useScrollPosition } from 'app/hooks';
import { ActiveLink } from 'components/active-link/active-link';
import { SearchProducts } from 'components/header/search/search';
import { selectCart, showCartSidebar } from 'app/store/slices/cart';
import { GlobalNotification } from 'components/global-notification/global-notification';

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { cart } = useAppSelector(selectCart);

  const [isWindowScrollAtTop, setIsWindowScrollAtTop] = useState(true);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  // track current route
  const { isRootRoute, isOrganizationRoute } = useMemo(() => {
    return {
      isRootRoute: router.route === '/',
      isOrganizationRoute: router.route === '/organizations/[organizationSlug]',
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
    return isRootRoute || isOrganizationRoute;
  }, [isRootRoute, isOrganizationRoute]);

  const handleNavbarToggle = useCallback((newIsNavbarExpanded) => {
    setIsNavbarExpanded(newIsNavbarExpanded);
  }, []);

  const handleCartSidebarShow = useCallback(() => {
    dispatch(showCartSidebar());
  }, []);

  return (
    <header className={styles.header}>
      <Navbar
        expand="lg"
        fixed="top"
        expanded={isNavbarExpanded}
        onToggle={handleNavbarToggle}
        className={classNames(styles.navbar, {
          [styles.navbarWithBorder]: showNavbarBorder,
        })}
      >
        <GlobalNotification />
        <Container className={styles.container}>
          <Link href="/" passHref>
            <Navbar.Brand className={styles.navbarBrand}>
              <Image
                src="/images/logo/ShortageGlobal-black.png"
                alt="ShortageGlobal"
                layout="fill"
                priority
              />
            </Navbar.Brand>
          </Link>

          <Navbar.Toggle aria-controls="header-navbar-nav" />

          <Navbar.Collapse
            className={styles.navbarCollapse}
            id="header-navbar-nav"
          >
            {shouldShowSearchField ? <SearchProducts /> : null}

            <Nav>
              <ActiveLink href="/how-it-works" passHref>
                <Nav.Link>How it works</Nav.Link>
              </ActiveLink>

              <NavDropdown title="For partners" id="basic-nav-dropdown">
                <ActiveLink href="/for-partners/non-profit" passHref>
                  <NavDropdown.Item>Non-profit</NavDropdown.Item>
                </ActiveLink>
                <ActiveLink href="/for-partners/corporate" passHref>
                  <NavDropdown.Item>Corporate</NavDropdown.Item>
                </ActiveLink>
              </NavDropdown>

              <ActiveLink href="/impact-stories" passHref>
                <Nav.Link>Impact Stories</Nav.Link>
              </ActiveLink>

              <Link href="/" passHref>
                <Nav.Link>
                  <User />
                </Nav.Link>
              </Link>

              <Button
                variant=""
                className={classNames(styles.button, styles.packageButton)}
                onClick={handleCartSidebarShow}
              >
                <Package />

                {/* Count of Products in the cart  */}
                {cart?.items.length > 0 ? (
                  <Badge pill className={styles.packageButtonBadge}>
                    {cart.items.length}
                    <span className="visually-hidden"> products in cart</span>
                  </Badge>
                ) : null}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
