import commonStyles from 'styles/pages/private/common.module.scss';
import styles from 'styles/pages/private/donations/donation.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useMemo, useState, useCallback } from 'react';
import { Row, Col, Accordion, Button, Alert } from 'react-bootstrap';
import { Loader, Paperclip, RefreshCw } from 'react-feather';
import Head from 'next/head';
import Link from 'next/link';
import { manageNonprofitLayout } from 'core/layouts';
import { BreadcrumbsPortal } from 'core/layouts/breadcrumbs-portal/breadcrumbs-portal';
import { wrapper } from 'core/store';
import {
  fetchAccountOrganization,
  selectAccountOrganization,
} from 'core/store/slices/account-organization';
import {
  fetchAccountOrganizationPackage,
  selectAccountOrganizationPackage,
  patchPackage,
} from 'core/store/slices/account-organization-package';
import { selectPackageBlogPosts } from 'core/store/slices/package-blog-posts';
import {
  uploadTaxDeductionReceiptFile,
  generateTaxDeductionReceiptFile,
} from 'core/api';
import { useAppSelector, useAppDispatch, useNotifications } from 'core/hooks';
import { extractAccessTokenFromSession, formatPrice } from 'core/helpers';
import {
  Breadcrumbs,
  getHomeCrumb,
  getManageNonprofitCrumb,
  getManageNonprofitRootCrumb,
  getManageNonprofitDonationsCrumb,
  getManageNonprofitDonationDetailsCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { FileUploadInput } from 'components/file-upload-input/file-upload-input';
import { PackageStatusVisualization } from 'components/package-status-visualization/package-status-visualization';
import { PackageLogs } from 'components/package-logs/package-logs';
import { ProductCard } from 'components/manage-nonprofit/products/product-card/product-card';
import { BlogPostCard } from 'components/blog-posts/blog-post-card/blog-post-card';
import { PACKAGE_TYPE } from 'core/constants';
import type { NextPageWithLayout } from 'pages/_app';

const SECTION_KEY = Object.freeze({
  STATUS: 'STATUS',
  ITEMS: 'ITEMS',
  TRACKING: 'TRACKING',
  TAX_DEDUCTION: 'TAX_DEDUCTION',
  IMPACT_STORIES: 'IMPACT_STORIES',
});

const DonationDetailsPage: NextPageWithLayout = () => {
  const { showNotification } = useNotifications();
  const dispatch = useAppDispatch();

  const { organization } = useAppSelector(selectAccountOrganization);
  const { package: donation } = useAppSelector(
    selectAccountOrganizationPackage
  );

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getManageNonprofitCrumb(),
      getManageNonprofitRootCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getManageNonprofitDonationsCrumb({
        organizationSlug: organization.slug,
      }),
      getManageNonprofitDonationDetailsCrumb({
        organizationSlug: organization.slug,
        packageId: donation.uuid,
      }),
    ];
  }, [organization, donation]);

  const { packageBlogPosts } = useAppSelector(selectPackageBlogPosts);

  const totalPrice = useMemo(() => {
    if (!donation) {
      return null;
    }
    return donation.items.reduce(
      (sum, item) => sum + (item.product.price || 0) * item.quantity,
      0
    );
  }, [donation.items]);

  const [isTaxDeductionReceiptFileSaving, setIsTaxDeductionReceiptFileSaving] =
    useState(false);

  const handleTaxDeductionReceiptFileSave = useCallback(
    async ({ taxDeductionReceipt }) => {
      setIsTaxDeductionReceiptFileSaving(true);

      try {
        const response = await uploadTaxDeductionReceiptFile({
          organizationSlug: organization.slug,
          packageId: donation.uuid,
          tax_deduction_receipt: taxDeductionReceipt,
        });
        dispatch(patchPackage({ ...response.data }));
        setIsTaxDeductionReceiptFileSaving(false);
        showNotification({
          isSuccess: true,
          message: 'Tax deduction receipt uploaded successfully.',
        });
      } catch (rejection) {
        setIsTaxDeductionReceiptFileSaving(false);
        const rejectionDetails =
          rejection?.response?.data?.tax_deduction_receipt;
        let errorMessage = `Failed to upload a tax deduction receipt.`;
        if (rejectionDetails) {
          errorMessage = `${errorMessage} ${rejectionDetails}`;
        }
        showNotification({
          isFailure: true,
          message: errorMessage,
        });
      }
    },
    [organization, donation]
  );

  const handleTaxDeductionReceiptGenerate = useCallback(async () => {
    setIsTaxDeductionReceiptFileSaving(true);

    try {
      const response = await generateTaxDeductionReceiptFile({
        organizationSlug: organization.slug,
        packageId: donation.uuid,
      });
      dispatch(patchPackage({ ...response.data }));
      setIsTaxDeductionReceiptFileSaving(false);
      showNotification({
        isSuccess: true,
        message: 'Tax deduction receipt generated successfully.',
      });
    } catch (rejection) {
      setIsTaxDeductionReceiptFileSaving(false);
      const rejectionDetails = rejection?.response?.data?.details;
      let errorMessage = `Failed to generate a tax deduction receipt.`;
      if (rejectionDetails) {
        errorMessage = `${errorMessage} ${rejectionDetails}`;
      }
      showNotification({
        isFailure: true,
        message: errorMessage,
      });
    }
  }, [organization, donation]);

  return (
    <>
      <Head>
        <title>Account Donation Details | Shortage</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <div className={styles.donation}>
        <Row className={commonStyles.headerRow}>
          <Col>
            <h2 className={commonStyles.title}>Donation Details</h2>
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
                    <PackageStatusVisualization package={donation} />

                    <PackageLogs
                      organizationSlug={organization.slug}
                      packageId={donation.uuid}
                    />
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey={SECTION_KEY.ITEMS}>
                  <Accordion.Header>Items</Accordion.Header>
                  <Accordion.Body className={styles.packageItems}>
                    {donation.items.map((item) => {
                      return (
                        <ProductCard
                          key={item.product.id}
                          product={item.product}
                          organization={organization}
                        />
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
                      </>
                    ) : null}

                    <Row className="mt-3">
                      <Col>
                        <dt>Tax deduction receipt</dt>

                        {donation.tax_deduction_receipt ? (
                          <dd className="d-flex flex-wrap mt-2">
                            <Button
                              size="lg"
                              variant="outline-dark"
                              className="me-2"
                              href={donation.tax_deduction_receipt}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Paperclip />
                              <span>Tax deduction receipt</span>
                            </Button>

                            <Button
                              size="lg"
                              variant="outline-dark"
                              className="me-2"
                              onClick={() =>
                                handleTaxDeductionReceiptFileSave({
                                  taxDeductionReceipt: '',
                                })
                              }
                              disabled={
                                !donation || isTaxDeductionReceiptFileSaving
                              }
                            >
                              <span>Remove</span>
                            </Button>
                          </dd>
                        ) : null}

                        <Alert variant="info" className="my-3">
                          <ul className="m-0 ps-4">
                            <li>
                              You can upload a custom PDF file or try to
                              generate it.
                            </li>
                            <li>
                              If donor requested tax deduction and there is no
                              receipt yet, it will be generated automatically
                              when the donation is marked as{' '}
                              <i>&quot;Delivered&quot;</i>.
                            </li>
                            <li>
                              <Link
                                href={{
                                  pathname:
                                    '/private/manage-nonprofit/[organizationSlug]/tax-information/',
                                  query: {
                                    organizationSlug: organization.slug,
                                  },
                                }}
                              >
                                Tax information
                              </Link>{' '}
                              must be filled out to generate a tax deduction
                              receipt.
                            </li>
                          </ul>
                        </Alert>

                        <dt>Upload receipt</dt>

                        <div className="my-3">
                          <FileUploadInput
                            accept=".pdf"
                            onSave={(file) =>
                              handleTaxDeductionReceiptFileSave({
                                taxDeductionReceipt: file,
                              })
                            }
                            isLoading={isTaxDeductionReceiptFileSaving}
                            isDisabled={
                              !donation || isTaxDeductionReceiptFileSaving
                            }
                          />
                        </div>

                        <dt>Generate receipt</dt>

                        <div className="my-3">
                          <Button
                            variant="outline-dark"
                            className="me-2"
                            onClick={handleTaxDeductionReceiptGenerate}
                            disabled={
                              !donation || isTaxDeductionReceiptFileSaving
                            }
                          >
                            {isTaxDeductionReceiptFileSaving ? (
                              <Loader
                                size="1rem"
                                className={animationStyles.rotate}
                              />
                            ) : (
                              <RefreshCw size="1rem" />
                            )}
                            <span>Generate</span>
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey={SECTION_KEY.IMPACT_STORIES}>
                  <Accordion.Header>Impact Stories</Accordion.Header>
                  <Accordion.Body>
                    {packageBlogPosts?.length > 0 ? (
                      <div className={styles.blogPosts}>
                        {packageBlogPosts.map((blogPost) => {
                          return (
                            <BlogPostCard
                              key={blogPost.slug}
                              blogPost={blogPost}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div>
                        There are no published impact stories associated with
                        this donation yet.
                      </div>
                    )}
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

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const organizationSlug = context.params.organizationSlug as string;
    const packageId = context.params.packageId as string;

    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });

    await Promise.all([
      store.dispatch(
        fetchAccountOrganization({ organizationSlug, accessToken })
      ),
      store.dispatch(
        fetchAccountOrganizationPackage({
          organizationSlug,
          packageId,
          accessToken,
        })
      ),
    ]);

    const { accountOrganization, accountOrganizationPackage } =
      store.getState();

    if (
      accountOrganization.error?.status === 404 ||
      accountOrganizationPackage.error?.status === 404
    ) {
      return {
        redirect: {
          destination: '/private/manage-nonprofit/',
          permanent: false,
        },
      };
    }

    if (
      accountOrganization.error?.status === 401 ||
      accountOrganizationPackage.error?.status === 401
    ) {
      const callbackUrl = encodeURIComponent(context.resolvedUrl);
      return {
        redirect: {
          destination: `/account/sign-in/?callbackUrl=${callbackUrl}`,
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  }
);

DonationDetailsPage.getLayout = manageNonprofitLayout;

export default DonationDetailsPage;
