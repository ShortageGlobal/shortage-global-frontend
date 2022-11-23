import styles from 'styles/pages/private/donations/donation.module.scss';
import { useMemo } from 'react';
import { Row, Col, Accordion, Button } from 'react-bootstrap';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FileText } from 'react-feather';
import { accountLayout } from 'core/layouts';
import { AccountBreadcrumbsContainer } from 'core/layouts/account-layout/account-breadcrumbs-container';
import { wrapper } from 'core/store';
import { fetchAccountPackage } from 'core/api';
import { extractAccessTokenFromSession, formatPrice } from 'core/helpers';
import {
  Breadcrumbs,
  getHomeCrumb,
  getAccountDonationsCrumb,
  getAccountDonationDetailsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { PackageStatusVisualization } from 'components/package-status-visualization/package-status-visualization';
import { PackageLogs } from 'components/package-logs/package-logs';
import { PACKAGE_TYPE } from 'core/constants';
import type { NextPageWithLayout } from 'pages/_app';
import type { Package } from 'core/api/types';

const SECTION_KEY = Object.freeze({
  STATUS: 'STATUS',
  ITEMS: 'ITEMS',
  TRACKING: 'TRACKING',
  TAX_DEDUCTION: 'TAX_DEDUCTION',
});

type AccountDonationDetailsPageProps = {
  donation: Package;
};

const AccountDonationDetailsPage: NextPageWithLayout = ({
  donation,
}: AccountDonationDetailsPageProps) => {
  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getAccountDonationsCrumb(),
      getAccountDonationDetailsCrumb({
        packageId: donation.uuid,
        isActive: true,
      }),
    ];
  }, []);

  const organization = useMemo(() => {
    if (!donation) {
      return null;
    }
    // all package items must belong to a single organization,
    // so just pick the first item
    return donation.items[0].product.organization;
  }, [donation?.items]);

  const totalPrice = useMemo(() => {
    if (!donation) {
      return null;
    }
    return donation.items.reduce(
      (sum, item) => sum + (item.product.price || 0) * item.quantity,
      0
    );
  }, [donation.items]);

  return (
    <>
      <Head>
        <title>Account Donation Details | Shortage</title>
      </Head>

      <AccountBreadcrumbsContainer>
        <Breadcrumbs items={breadcrumbs} />
      </AccountBreadcrumbsContainer>

      <div className={styles.donation}>
        <Row>
          <Col>
            <h2 className={styles.header}>
              <span>Donation Details</span>
            </h2>
          </Col>
        </Row>

        <Row>
          <Col>
            {donation ? (
              <Accordion
                defaultActiveKey={Object.values(SECTION_KEY)}
                alwaysOpen
                className={styles.reviewDonationDetails}
              >
                <Accordion.Item eventKey={SECTION_KEY.STATUS}>
                  <Accordion.Header>Status</Accordion.Header>
                  <Accordion.Body className={styles.statusBody}>
                    <dl>
                      <dt>Recipient</dt>
                      <dd>
                        <Link
                          className={styles.orgLink}
                          href={{
                            pathname: '/organizations/[organizationSlug]/',
                            query: { organizationSlug: organization.slug },
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {organization.name}
                        </Link>
                      </dd>
                    </dl>

                    <PackageStatusVisualization package={donation} />

                    <PackageLogs
                      organizationSlug={organization.slug}
                      donation={donation}
                    />
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey={SECTION_KEY.ITEMS}>
                  <Accordion.Header>Items</Accordion.Header>
                  <Accordion.Body className={styles.packageItems}>
                    {donation.items.map((item) => {
                      const productPageHref = {
                        pathname:
                          '/organizations/[organizationSlug]/products/[productSlug]',
                        query: {
                          organizationSlug: item.product.organization.slug,
                          productSlug: item.product.slug,
                        },
                      };

                      return (
                        <div
                          key={item.product.slug}
                          className={styles.packageItem}
                        >
                          <div className={styles.photo}>
                            <Link
                              href={productPageHref}
                              aria-label="Visit product page"
                              className={styles.photoLink}
                            >
                              {item.product.photo ? (
                                <Image
                                  src={item.product.photo}
                                  alt={item.product.name}
                                  fill
                                  className={styles.photoImg}
                                />
                              ) : null}
                            </Link>
                          </div>

                          <div className={styles.name}>
                            <Link
                              href={productPageHref}
                              className={styles.nameLink}
                            >
                              {item.product.name}
                            </Link>
                          </div>

                          <dl className={styles.quantity}>
                            <dt>Quantity</dt>
                            <dd>{item.quantity}</dd>
                          </dl>

                          {donation.type === PACKAGE_TYPE.FUNDED_BY_DONOR ? (
                            <dl className={styles.price}>
                              <dt>Price</dt>
                              <dd>{formatPrice(item.product.price)}</dd>
                            </dl>
                          ) : null}
                        </div>
                      );
                    })}

                    {donation.type === PACKAGE_TYPE.FUNDED_BY_DONOR ? (
                      <dl>
                        <dt>Total donation (including Stripe fee and taxes)</dt>
                        <dd>{formatPrice(totalPrice)}</dd>
                      </dl>
                    ) : null}
                  </Accordion.Body>
                </Accordion.Item>

                {donation.type === PACKAGE_TYPE.SENT_BY_DONOR ? (
                  <Accordion.Item eventKey={SECTION_KEY.TRACKING}>
                    <Accordion.Header>Tracking</Accordion.Header>
                    <Accordion.Body as="dl">
                      <Row>
                        <Col sm={6}>
                          <dt>Shipping Carrier</dt>
                          <dd>{donation.delivery_company}</dd>
                        </Col>
                        <Col sm={6}>
                          <dt>Tracking Number</dt>
                          <dd>{donation.tracking_code}</dd>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                ) : null}

                <Accordion.Item eventKey={SECTION_KEY.TAX_DEDUCTION}>
                  <Accordion.Header>Tax Deduction / Details</Accordion.Header>
                  <Accordion.Body as="dl" className={styles.body}>
                    <Row>
                      <Col>
                        <dt>Request Tax Deduction</dt>
                        <dd>{donation.need_tax_deduction ? 'Yes' : 'No'}</dd>
                      </Col>
                    </Row>

                    <Row>
                      {donation.first_name ? (
                        <Col>
                          <dt>First Name</dt>
                          <dd>{donation.first_name}</dd>
                        </Col>
                      ) : null}
                      {donation.last_name ? (
                        <Col>
                          <dt>Last Name</dt>
                          <dd>{donation.last_name}</dd>
                        </Col>
                      ) : null}
                    </Row>

                    <Row>
                      {donation.email ? (
                        <Col>
                          <dt>Email</dt>
                          <dd>{donation.email}</dd>
                        </Col>
                      ) : null}
                      {donation.phone_number ? (
                        <Col>
                          <dt>Phone Number</dt>
                          <dd>{donation.phone_number}</dd>
                        </Col>
                      ) : null}
                    </Row>

                    {donation.need_tax_deduction ? (
                      <>
                        <Row>
                          {donation.address_line1 ? (
                            <Col>
                              <dt>Address Line 1</dt>
                              <dd>{donation.address_line1}</dd>
                            </Col>
                          ) : null}
                          {donation.address_line2 ? (
                            <Col>
                              <dt>Address Line 2</dt>
                              <dd>{donation.address_line2}</dd>
                            </Col>
                          ) : null}
                        </Row>

                        <Row>
                          {donation.city ? (
                            <Col>
                              <dt>City</dt>
                              <dd>{donation.city}</dd>
                            </Col>
                          ) : null}

                          {donation.state_province_region ? (
                            <Col>
                              <dt>State / Province</dt>
                              <dd>{donation.state_province_region}</dd>
                            </Col>
                          ) : null}
                        </Row>

                        <Row>
                          {donation.zip ? (
                            <Col>
                              <dt>Zip</dt>
                              <dd>{donation.zip}</dd>
                            </Col>
                          ) : null}

                          {donation.country ? (
                            <Col>
                              <dt>Country</dt>
                              <dd>{donation.country}</dd>
                            </Col>
                          ) : null}
                        </Row>

                        {donation.tax_deduction_receipt &&
                        donation.need_tax_deduction ? (
                          <Row>
                            <Col>
                              <dt>Tax deduction receipt</dt>
                              <dd>
                                <Button
                                  size="lg"
                                  href={donation.tax_deduction_receipt}
                                  variant="outline-dark"
                                  className={
                                    styles.downloadTaxDeductionReceiptBtn
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <FileText />
                                  <span>See the tax deduction receipt</span>
                                </Button>
                              </dd>
                            </Col>
                          </Row>
                        ) : null}
                      </>
                    ) : null}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ) : null}
          </Col>
        </Row>
      </div>
    </>
  );
};

AccountDonationDetailsPage.getLayout = accountLayout;

export const getServerSideProps = wrapper.getServerSideProps(
  () => async (context) => {
    const packageId = context.params.packageId as string;

    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });

    let donationResponse;
    try {
      // fetch package
      donationResponse = await fetchAccountPackage({
        packageId,
        accessToken,
      });
    } catch (rejection) {
      if (rejection?.response?.status === 404) {
        return {
          notFound: true,
        };
      }

      if (rejection?.response?.status === 401) {
        return {
          redirect: {
            destination: `/account/sign-in/?callbackUrl=${encodeURIComponent(
              context.resolvedUrl
            )}`,
            permanent: false,
          },
        };
      }

      throw rejection;
    }

    return {
      props: { donation: donationResponse.data },
    };
  }
);

export default AccountDonationDetailsPage;
