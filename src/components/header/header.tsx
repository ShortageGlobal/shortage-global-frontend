import styles from './header.module.scss';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Navbar, Nav, NavDropdown, Form } from 'react-bootstrap';
import { User, Package } from 'react-feather';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectSearch, setSearchQuery } from 'app/store/slices/search';
import { ActiveLink } from 'components/active-link/active-link';

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector(selectSearch);

  const handleSearchQueryChange = useCallback(
    (e) => {
      const newSearchQuery = e.target.value;

      // change "search" query parameter
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            search: newSearchQuery,
          },
        },
        undefined,
        { shallow: true } // do not run getServerSideProps
      );

      dispatch(setSearchQuery(newSearchQuery));
    },
    [router]
  );

  return (
    <header className={styles.header}>
      <Navbar expand="lg" fixed="top" className={styles.navbar}>
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
            <Form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Form.Control
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchQueryChange}
              />
            </Form>

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

              <Link href="/" passHref>
                <Nav.Link>
                  <Package />
                </Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
