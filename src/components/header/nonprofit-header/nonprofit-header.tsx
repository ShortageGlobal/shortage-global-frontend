import styles from 'components/header/header.module.scss';
import { useCallback, useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Menu, X } from 'react-feather';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LogoImage } from 'components/logo-image/logo-image';
// import { ActiveLink } from 'components/active-link/active-link';
import { AccountDropdown } from 'components/header/nonprofit-header/account-dropdown/account-dropdown';

export function NonprofitHeader() {
  const router = useRouter();

  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  // collapse navbar on route change
  useEffect(() => {
    setIsNavbarExpanded(false);
  }, [router.route]);

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
        className={styles.navbar}
      >
        <Container className={styles.container}>
          <Link
            href="/private/manage-nonprofit/"
            className={styles.logo}
            aria-label="Shortage"
          >
            <LogoImage />
          </Link>

          <div className={styles.controlsBar}>
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
          </div>

          <Navbar.Collapse
            className={styles.navbarCollapse}
            id="header-navbar-nav"
          >
            <div className={styles.navbarCollapsedTopPlaceholder} />

            <Nav>
              {/* <ActiveLink href="/for-individuals/" passHref>
                <Nav.Link>For Individuals</Nav.Link>
              </ActiveLink> */}
            </Nav>
          </Navbar.Collapse>

          <AccountDropdown toggleClassName={styles.headerControlExpandedNav} />
        </Container>
      </Navbar>
    </header>
  );
}
