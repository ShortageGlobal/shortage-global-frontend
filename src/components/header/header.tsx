import styles from './header.module.scss';
import Link from 'next/link';
import { Container, Navbar, Nav, NavDropdown, Form } from 'react-bootstrap';

export function Header() {
  return (
    <header className={styles.header}>
      <Navbar expand="lg" className={`${styles.navbar} fixed-top`}>
        <Container className={`${styles.container} border-bottom`}>
          <Link href="/" passHref>
            <Navbar.Brand>ShortageGlobal</Navbar.Brand>
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
              <Link href="/how-it-works" passHref>
                <Nav.Link>How it works</Nav.Link>
              </Link>

              <NavDropdown title="For partners" id="basic-nav-dropdown">
                <Link href="/for-partners/non-profit" passHref>
                  <NavDropdown.Item>Non-profit</NavDropdown.Item>
                </Link>
                <Link href="/for-partners/corporate" passHref>
                  <NavDropdown.Item>Corporate</NavDropdown.Item>
                </Link>
              </NavDropdown>

              <Link href="/impact-stories" passHref>
                <Nav.Link>Impact Stories</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
