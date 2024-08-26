import styles from 'styles/pages/shopify-privacy-policy.module.scss';
import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Head from 'next/head';
import {
  Breadcrumbs,
  getHomeCrumb,
  getShopifyPrivacyPolicyCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { NextPageWithLayout } from 'pages/_app';
import { SHOPIFY_APP_URL } from 'core/constants';

const ShopifyPrivacyPolicy: NextPageWithLayout = () => {
  const breadcrumbs = useMemo(() => {
    return [getHomeCrumb(), getShopifyPrivacyPolicyCrumb({ isActive: true })];
  }, []);

  return (
    <>
      <Head>
        <title>Privacy Policy for Shortage App | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container className={styles.container}>
        <Row className="justify-content-center">
          <Col md="8">
            <header>
              <h2 className={styles.header}>
                Privacy Policy for{' '}
                <Link href={SHOPIFY_APP_URL}>Shortage App</Link>
              </h2>
              <p className={styles.effectiveFrom}>
                Last updated: September 1, 2024
              </p>
            </header>
          </Col>
        </Row>

        <Row>
          <Col className={styles.shopifyPrivacyPolicy}>
            <h4 className={styles.sectionHeader}>1. Introduction</h4>

            <p>
              This Privacy Policy (“Policy”) explains how Shortage, Inc. (“we,”
              “us,” or “our”) collects, uses, and discloses information about
              customers who use our Shopify app (“App”). This Policy applies to
              information collected through the App, including when you add
              products for donation to a nonprofit organization, manage your
              donations, or interact with us in other ways.
            </p>

            <h4 className={styles.sectionHeader}>2. Scope</h4>

            <p>
              This Policy does not apply to other services or third-party
              websites linked from our App. We are not responsible for the
              privacy practices of other entities, and we encourage you to
              review their privacy policies.
            </p>

            <h4 className={styles.sectionHeader}>3. Changes to This Policy</h4>

            <p>
              We may update this Policy. We will notify you of any material
              changes by updating the effective date at the top of this Policy
              or through other communication methods. We encourage you to review
              this Policy periodically to stay informed about our privacy
              practices.
            </p>

            <h4 className={styles.sectionHeader}>
              4. Collection of Personal Information
            </h4>

            <h4 className={styles.sectionHeader}>
              4.1 Information You Provide
            </h4>

            <p>
              When using the App, we may collect the following personal
              information directly from you:
            </p>

            <ul>
              <li>
                <b>Account Information</b>: Name, email address, and other
                details you provide when creating an account or making a
                donation.
              </li>
              <li>
                <b>Transaction Information</b>: Details about the products added
                to your cart for donation, the amount of your donation, and
                payment information processed through our third-party payment
                processor.
              </li>
              <li>
                <b>Communication Information</b>: Information you provide when
                contacting us for support or feedback.
              </li>
            </ul>

            <h4 className={styles.sectionHeader}>
              4.2 Automatic Data Collection
            </h4>

            <p>
              We collect information automatically through the App, including:
            </p>

            <ul>
              <li>
                <b>Device and Usage Information</b>: IP address, browser type,
                device identifiers, and usage data such as pages viewed and
                actions taken within the App.
              </li>
              <li>
                <b>Cookies and Tracking Technologies</b>: We use cookies and
                similar technologies to enhance your experience, track
                engagement, and analyze usage patterns.
              </li>
            </ul>

            <h4 className={styles.sectionHeader}>
              5. Use of Personal Information
            </h4>

            <p>We use your personal information to:</p>

            <ul>
              <li>
                <b>Process Donations</b>: Manage and facilitate donations made
                through the App.
              </li>
              <li>
                <b>Improve the App</b>: Analyze usage patterns and improve the
                functionality and performance of the App.
              </li>
              <li>
                <b>Customer Support</b>: Respond to inquiries, provide support,
                and address any issues you may encounter.
              </li>
              <li>
                <b>Communications</b>: Send you updates, promotional
                information, and other relevant messages, provided you have not
                opted out.
              </li>
            </ul>

            <h4 className={styles.sectionHeader}>
              6. Disclosure of Personal Information
            </h4>

            <p>
              We may disclose your personal information in the following
              circumstances:
            </p>

            <ul>
              <li>
                <b>Service Providers</b>: To third-party vendors who assist us
                in operating the App and processing transactions, such as
                payment processors and customer support services.
              </li>
              <li>
                <b>Nonprofit Organizations</b>: To the nonprofit organizations
                you choose to support through the App.
              </li>
              <li>
                <b>Legal Compliance</b>: To comply with legal obligations,
                respond to lawful requests, or protect the rights, property, or
                safety of Shortage, Inc., our users, or others.
              </li>
              <li>
                <b>Business Transfers</b>: In connection with a merger,
                acquisition, or sale of assets.
              </li>
            </ul>

            <h4 className={styles.sectionHeader}>7. Your Rights and Choices</h4>

            <h4 className={styles.sectionHeader}>7.1 Access and Correction</h4>

            <p>
              You can review and update your personal information by accessing
              your account settings within the App. For any additional requests,
              please contact us directly.
            </p>

            <h4 className={styles.sectionHeader}>7.2 Opt-Out</h4>

            <p>
              You may opt out of receiving promotional communications from us by
              following the unsubscribe instructions included in each email or
              by contacting us.
            </p>

            <h4 className={styles.sectionHeader}>7.3 Cookies and Tracking</h4>

            <p>
              You can adjust your browser settings to refuse cookies, but this
              may affect your experience with the App.
            </p>

            <h4 className={styles.sectionHeader}>8. Security</h4>

            <p>
              We take reasonable measures to protect your personal information
              from unauthorized access and use. However, no security measures
              are completely foolproof, and we cannot guarantee the security of
              your information.
            </p>

            <h4 className={styles.sectionHeader}>9. Contact Us</h4>

            <p>
              If you have any questions or concerns about this Privacy Policy or
              our privacy practices, please contact us at:
            </p>

            <p>Shortage</p>
            <p>440 N Barranca Ave #7074</p>
            <p>Covina, CA 91723</p>
            <p>
              Email:{' '}
              <a href="mailto:support@shortage.global">
                support@shortage.global
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ShopifyPrivacyPolicy;
