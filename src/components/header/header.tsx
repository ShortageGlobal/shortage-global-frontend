import styles from './header.module.scss';
import { useCallback, useState, useMemo, useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Menu } from 'react-feather';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector, useScrollPosition } from 'app/hooks';
import { selectSearch } from 'app/store/slices/search';
import { ActiveLink } from 'components/active-link/active-link';
import { SearchProducts } from 'components/header/search/search';
import { CartButton } from 'components/cart/cart-button/cart-button';

export function Header() {
  const router = useRouter();

  const { searchQuery, isSearchInputFocused } = useAppSelector(selectSearch);

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

  return (
    <header className={styles.header}>
      <Navbar
        expand="lg"
        fixed="top"
        expanded={isNavbarExpanded}
        onToggle={handleNavbarToggle}
        className={classNames(styles.navbar, {
          [styles.navbarWithBorder]: showNavbarBorder,
          [styles.withSearchExpanded]:
            isSearchInputFocused || searchQuery?.length > 0,
        })}
      >
        {/* <GlobalNotification /> */}
        <Container className={styles.container}>
          <Link href="/" passHref>
            <Navbar.Brand className={styles.navbarBrand}>
              <Image
                src="/images/logo/Shortage.svg"
                alt="Shortage"
                layout="fill"
                priority
              />
            </Navbar.Brand>
          </Link>

          <div className={styles.controlsBar}>
            {shouldShowSearchField ? <SearchProducts /> : null}

            <Button
              variant=""
              className={styles.navbarToggle}
              onClick={() => setIsNavbarExpanded(!isNavbarExpanded)}
            >
              <Menu />
            </Button>

            <CartButton className={styles.cartButtonCollapsedNav} />
          </div>

          <Navbar.Collapse
            className={styles.navbarCollapse}
            id="header-navbar-nav"
          >
            <div className={styles.navbarCollapsedTopPlaceholder} />

            <Nav>
              <ActiveLink href="/about-us" passHref>
                <Nav.Link>About Us</Nav.Link>
              </ActiveLink>

              <ActiveLink href="/for-nonprofit" passHref>
                <Nav.Link>For Nonprofit</Nav.Link>
              </ActiveLink>

              <ActiveLink href="/for-corporate" passHref>
                <Nav.Link>For Corporate</Nav.Link>
              </ActiveLink>

              {/* <ActiveLink href="/impact-stories" passHref>
                <Nav.Link>Impact Stories</Nav.Link>
              </ActiveLink> */}

              {/* <Link href="/" passHref>
                <Nav.Link className={styles.control}>
                  <User />

                  <span className={styles.controlText}>Account</span>
                </Nav.Link>
              </Link> */}
            </Nav>
          </Navbar.Collapse>

          <CartButton className={styles.cartButtonExpandedNav} />
        </Container>
      </Navbar>
    </header>
  );
}
