import styles from 'components/header/header.module.scss';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Menu, Send, X } from 'react-feather';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppSelector } from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import { LogoImage } from 'components/logo-image/logo-image';
import { ActiveLink } from 'components/active-link/active-link';
import { AccountDropdown } from 'components/header/nonprofit-header/account-dropdown/account-dropdown';
import { PublishModal } from 'components/manage-nonprofit/publish-modal/publish-modal';

export function NonprofitHeader() {
  const router = useRouter();
  const { organization } = useAppSelector(selectAccountOrganization);

  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  const [isPublishNavbarShown, setIsPublishNavbarShown] = useState(false);

  const hasNavbar = useMemo(() => Boolean(organization), [organization]);

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
          <Link href="/" className={styles.logo} aria-label="Shortage">
            <LogoImage />
          </Link>

          <div className={styles.controlsBar}>
            {hasNavbar ? (
              <Button
                variant=""
                className={styles.navbarToggle}
                onClick={() => setIsNavbarExpanded(!isNavbarExpanded)}
                aria-label="Toggle menu"
              >
                {isNavbarExpanded ? <X /> : <Menu />}
              </Button>
            ) : null}

            <AccountDropdown
              toggleClassName={styles.headerControlCollapsedNav}
            />
          </div>

          {hasNavbar ? (
            <Navbar.Collapse
              className={styles.navbarCollapse}
              id="header-navbar-nav"
            >
              <div className={styles.navbarCollapsedTopPlaceholder} />

              <Nav>
                {organization.is_draft ? (
                  <Nav.Item>
                    <Button
                      variant="outline-primary"
                      className="me-3"
                      onClick={() => setIsPublishNavbarShown(true)}
                    >
                      <Send size="1.25rem" />
                      <span>Publish</span>
                    </Button>
                  </Nav.Item>
                ) : null}

                <PublishModal
                  show={isPublishNavbarShown}
                  onHide={() => setIsPublishNavbarShown(false)}
                />

                <ActiveLink href={`/${organization.slug}/`} passHref>
                  <Nav.Link>
                    <span>Go To Page</span>
                  </Nav.Link>
                </ActiveLink>
              </Nav>
            </Navbar.Collapse>
          ) : null}

          <AccountDropdown toggleClassName={styles.headerControlExpandedNav} />
        </Container>
      </Navbar>
    </header>
  );
}
