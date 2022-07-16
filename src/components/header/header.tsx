import styles from './header.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Navbar, Nav, NavDropdown, Form } from 'react-bootstrap';
import { ActiveLink } from 'components/active-link/active-link';

export function Header() {
  return (
    <header className={styles.header}>
      <Navbar expand="lg" fixed="top" className={styles.navbar}>
        <Container className={`${styles.container} border-bottom`}>
          <Link href="/" passHref>
            <Navbar.Brand className={styles['navbar-brand']}>
              <Image
                src="/logo/ShortageGlobal-black.png"
                alt="ShortageGlobal"
                layout="fill"
                priority
              />
            </Navbar.Brand>
          </Link>

          <Navbar.Toggle aria-controls="header-navbar-nav" />

          <Navbar.Collapse
            className={styles['navbar-collapse']}
            id="header-navbar-nav"
          >
            <Form>
              <Form.Control type="search" placeholder="Search" />
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
