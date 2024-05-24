import commonStyles from 'styles/pages/private/common.module.scss';
import styles from 'styles/pages/private/manage-nonprofit/donation.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  Row,
  Col,
  Accordion,
  Button,
  Alert,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import {
  Loader,
  Paperclip,
  RefreshCw,
  DollarSign,
  Package,
  ShoppingBag,
  Copy,
  Check,
  FilePlus,
  X,
} from 'react-feather';
import classNames from 'classnames';
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
import {
  uploadTaxDeductionReceiptFile,
  generateTaxDeductionReceiptFile,
  setOrganizationPackageBlogPosts,
  fetchOrganizationPackageBlogPosts,
} from 'core/api';
import {
  useAppSelector,
  useAppDispatch,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import {
  extractAccessTokenFromSession,
  fileDownload,
  formatPrice,
} from 'core/helpers';
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
import { ConfirmDonationDeliveredModal } from 'components/manage-nonprofit/donations/confirm-donation-delivered-modal/confirm-donation-delivered-modal';
import { PackageLogs } from 'components/package-logs/package-logs';
import { ProductCard } from 'components/manage-nonprofit/products/product-card/product-card';
import { BlogPostCard } from 'components/manage-nonprofit/blog-posts/blog-post-card/blog-post-card';
import { SelectBlogPostModal } from 'components/manage-nonprofit/blog-posts/select-blog-post-modal/select-blog-post-modal';
import {
  PACKAGE_STATUS,
  PACKAGE_TYPE,
  PACKAGE_TYPE_DISPLAY_LABELS,
} from 'core/constants';
import type { NextPageWithLayout } from 'pages/_app';
import type { AccountBlogPost } from 'core/api/types';

const SECTION_KEY = Object.freeze({
  STATUS: 'STATUS',
  ITEMS: 'ITEMS',
  NOTE: 'NOTE',
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
        isActive: true,
      }),
    ];
  }, [organization, donation]);

  const [blogPosts, setBlogPosts] = useState<AccountBlogPost[]>([]);
  const [isBlogPostsLoading, setIsBlogPostsLoading] = useState(true);

  const getFetchBlogPostsCancelToken = useCancelToken();

  const fetchBlogPosts = useCallback(async () => {
    const cancelToken = getFetchBlogPostsCancelToken();

    setIsBlogPostsLoading(true);

    try {
      const response = await fetchOrganizationPackageBlogPosts({
        organizationSlug: organization.slug,
        packageId: donation.uuid,
        cancelToken,
      });

      setBlogPosts(response.data);
      setIsBlogPostsLoading(false);
    } catch (rejection) {
      if (isRequestCancel(rejection)) {
        return;
      }
      const rejectionErrors = rejection?.response?.data;
      showNotification({
        isFailure: true,
        message: rejectionErrors?.details || 'Failed to get Impact Stories',
      });
      setIsBlogPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogPosts();
  }, [donation.blog_posts]);

  const totalPrice = useMemo(() => {
    if (!donation) {
      return null;
    }
    return donation.items.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );
  }, [donation.items]);

  const canMarkAsDelivered = useMemo(() => {
    return (
      [PACKAGE_STATUS.CONFIRMED, PACKAGE_STATUS.ON_ITS_WAY].some(
        (s) => s === donation.status
      ) ||
      (donation.type === PACKAGE_TYPE.DROPPED_OFF_BY_DONOR &&
        donation.status !== PACKAGE_STATUS.DELIVERED)
    );
  }, [donation]);

  const [
    isConfirmMarkAsDeliveredModalShown,
    setIsConfirmMarkAsDeliveredModalShown,
  ] = useState(false);

  const [isSelectBlogPostModalShown, setIsSelectBlogPostModalShown] =
    useState(false);

  const [isTaxDeductionReceiptFileSaving, setIsTaxDeductionReceiptFileSaving] =
    useState(false);

  const [isBlogPostAttachPending, setIsBlogPostAttachPending] = useState(false);

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

  const handleMarkAsDelivered = useCallback(() => {
    setIsConfirmMarkAsDeliveredModalShown(true);
  }, []);

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

  const clearCopyTrackingCodeSuccessTooltipTimeout =
    useRef<ReturnType<typeof setTimeout>>();

  const [
    showCopyTrackingCodeSuccessTooltip,
    setShowCopyTrackingCodeSuccessTooltip,
  ] = useState(false);

  const handleTrackingCodeCopy = useCallback(() => {
    navigator.clipboard.writeText(donation.tracking_code);
    clearTimeout(clearCopyTrackingCodeSuccessTooltipTimeout.current);
    clearCopyTrackingCodeSuccessTooltipTimeout.current = setTimeout(() => {
      setShowCopyTrackingCodeSuccessTooltip(false);
    }, 2000);
    setShowCopyTrackingCodeSuccessTooltip(true);
  }, [donation.tracking_code]);

  const handleAttachBlogPost = useCallback(
    async (blogPostId: AccountBlogPost['uuid']) => {
      setIsSelectBlogPostModalShown(false);

      if (blogPosts.some((blogPost) => blogPost.uuid === blogPostId)) {
        // do not attach already attached blog post
        return;
      }

      const blogPostIds = [
        ...blogPosts.map((blogPost) => blogPost.uuid),
        blogPostId,
      ];

      setIsBlogPostAttachPending(true);
      try {
        const response = await setOrganizationPackageBlogPosts({
          organizationSlug: organization.slug,
          packageId: donation.uuid,
          blogPostIds,
        });
        dispatch(patchPackage({ ...response.data }));
        setIsBlogPostAttachPending(false);
        showNotification({
          isSuccess: true,
          message: 'Impact Story attached successfully.',
        });
      } catch (rejection) {
        setIsBlogPostAttachPending(false);
        const rejectionDetails = rejection?.response?.data?.details;
        let errorMessage = `Failed to attach an Impact Story.`;
        if (rejectionDetails) {
          errorMessage = `${errorMessage} ${rejectionDetails}`;
        }
        showNotification({
          isFailure: true,
          message: errorMessage,
        });
      }
    },
    [organization, blogPosts]
  );

  const handleDetachBlogPost = useCallback(
    async (blogPostId: AccountBlogPost['uuid']) => {
      if (blogPosts.every((blogPost) => blogPost.uuid !== blogPostId)) {
        // do not detach already detached blog post
        return;
      }

      const blogPostIds = blogPosts
        .map((blogPost) => blogPost.uuid)
        .filter((uuid) => uuid !== blogPostId);

      setIsBlogPostAttachPending(true);
      try {
        const response = await setOrganizationPackageBlogPosts({
          organizationSlug: organization.slug,
          packageId: donation.uuid,
          blogPostIds,
        });
        dispatch(patchPackage({ ...response.data }));
        setIsBlogPostAttachPending(false);
        showNotification({
          isSuccess: true,
          message: 'Impact Story detached successfully.',
        });
      } catch (rejection) {
        setIsBlogPostAttachPending(false);
        const rejectionDetails = rejection?.response?.data?.details;
        let errorMessage = `Failed to detach an Impact Story.`;
        if (rejectionDetails) {
          errorMessage = `${errorMessage} ${rejectionDetails}`;
        }
        showNotification({
          isFailure: true,
          message: errorMessage,
        });
      }
    },
    [organization, blogPosts]
  );

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
              >
                <Accordion.Item eventKey={SECTION_KEY.STATUS}>
                  <Accordion.Header>Status</Accordion.Header>
                  <Accordion.Body className={styles.statusBody}>
                    <div>
                      <div className="d-flex align-items-center">
                        {donation.type === PACKAGE_TYPE.SENT_BY_DONOR ||
                        donation.type === PACKAGE_TYPE.DROPPED_OFF_BY_DONOR ? (
                          <Package size="1rem" />
                        ) : null}
                        {donation.type === PACKAGE_TYPE.FUNDED_BY_DONOR ? (
                          <DollarSign size="1rem" />
                        ) : null}
                        {donation.type === PACKAGE_TYPE.SHOPIFY_PURCHASE ? (
                          <ShoppingBag size="1rem" />
                        ) : null}
                        <span className="ms-1">
                          {PACKAGE_TYPE_DISPLAY_LABELS[donation.type]}
                        </span>
                      </div>

                      {donation.campaign ? (
                        <div className="mt-2">
                          For the &quot;
                          <Link
                            href={{
                              pathname:
                                '/private/manage-nonprofit/[organizationSlug]/campaigns/[campaignUuid]/',
                              query: {
                                organizationSlug: organization.slug,
                                campaignUuid: donation.campaign.uuid,
                              },
                            }}
                          >
                            {donation.campaign.name}
                          </Link>
                          &quot; campaign
                        </div>
                      ) : null}
                    </div>

                    <PackageStatusVisualization
                      type={donation.type}
                      status={donation.status}
                    />

                    <PackageLogs
                      organizationSlug={organization.slug}
                      packageId={donation.uuid}
                    />

                    {/* Mark as "Delivered" button */}
                    {canMarkAsDelivered ? (
                      <div>
                        <Alert variant="info">
                          <ul className="m-0 ps-4">
                            <li>
                              If you have received the gift, you can notify the
                              donor by marking the donation as
                              &quot;Delivered&quot;.
                            </li>
                            <li>
                              It&apos;s <strong>highly recommended</strong> to
                              attach an Impact Story about the donation with
                              photos of the package. Let them know how thankful
                              you are and it will encourage others to donate to
                              your cause.
                            </li>
                          </ul>
                        </Alert>

                        <Button size="lg" onClick={handleMarkAsDelivered}>
                          <Check size="1rem" />
                          <span>Mark as &quot;Delivered&quot;</span>
                        </Button>
                      </div>
                    ) : null}

                    <ConfirmDonationDeliveredModal
                      organization={organization}
                      donation={donation}
                      show={isConfirmMarkAsDeliveredModalShown}
                      onHide={() =>
                        setIsConfirmMarkAsDeliveredModalShown(false)
                      }
                    />
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey={SECTION_KEY.ITEMS}>
                  <Accordion.Header>Items</Accordion.Header>
                  <Accordion.Body className={commonStyles.list}>
                    {donation.items.map((item) => {
                      return (
                        <ProductCard
                          key={item.product.id}
                          quantity={item.quantity}
                          id={item.product.id}
                          name={item.name}
                          category={item.category}
                          photo={item.photo}
                          price={item.price}
                          organization={organization}
                        />
                      );
                    })}

                    {donation.type === PACKAGE_TYPE.FUNDED_BY_DONOR ? (
                      <dl className="mt-4">
                        <dt>
                          Total amount funded (including delivery, taxes, and
                          administration fee)
                        </dt>
                        <dd>{formatPrice(totalPrice)}</dd>
                      </dl>
                    ) : null}
                  </Accordion.Body>
                </Accordion.Item>

                {donation.note ? (
                  <Accordion.Item eventKey={SECTION_KEY.NOTE}>
                    <Accordion.Header>Note From Donor</Accordion.Header>
                    <Accordion.Body>{donation.note}</Accordion.Body>
                  </Accordion.Item>
                ) : null}

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
                          <dd>
                            <span>{donation.tracking_code}</span>

                            <OverlayTrigger
                              show={showCopyTrackingCodeSuccessTooltip}
                              placement="top"
                              overlay={
                                <Tooltip>
                                  <span className="d-flex align-items-center">
                                    <Check size="1rem" />
                                    <span className="ms-1">Copied!</span>
                                  </span>
                                </Tooltip>
                              }
                            >
                              <Copy
                                size="1rem"
                                role="button"
                                className="ms-2"
                                onClick={handleTrackingCodeCopy}
                              />
                            </OverlayTrigger>
                          </dd>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                ) : null}

                <Accordion.Item eventKey={SECTION_KEY.TAX_DEDUCTION}>
                  <Accordion.Header>Tax Deduction / Details</Accordion.Header>
                  <Accordion.Body as="dl">
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
                              onClick={() =>
                                fileDownload(
                                  donation.tax_deduction_receipt,
                                  'tax_deduction_receipt.pdf'
                                )
                              }
                            >
                              <Paperclip />
                              <span>Tax deduction receipt</span>
                            </Button>

                            <Button
                              size="lg"
                              variant="outline-danger"
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
                              <span>Delete</span>
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
                            variant="outline-primary"
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
                    {blogPosts?.length > 0 ? (
                      <div
                        className={classNames(commonStyles.list, {
                          [commonStyles.loading]: isBlogPostsLoading,
                        })}
                      >
                        {blogPosts.map((blogPost) => {
                          return (
                            <div
                              key={blogPost.slug}
                              className={styles.blogPostRow}
                            >
                              <BlogPostCard
                                className={styles.blogPostCard}
                                organization={organization}
                                blogPost={blogPost}
                              />

                              <Button
                                className={styles.detachBlogPostBtn}
                                variant="outline-dark"
                                onClick={() =>
                                  handleDetachBlogPost(blogPost.uuid)
                                }
                              >
                                <X />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div>
                        There are no published Impact Stories associated with
                        this donation yet.
                      </div>
                    )}

                    <Button
                      className="my-3"
                      variant="outline-dark"
                      onClick={() => setIsSelectBlogPostModalShown(true)}
                      disabled={isBlogPostAttachPending || isBlogPostsLoading}
                    >
                      {isBlogPostAttachPending || isBlogPostsLoading ? (
                        <Loader
                          size="1rem"
                          className={animationStyles.rotate}
                        />
                      ) : (
                        <FilePlus size="1rem" />
                      )}
                      <span>Attach Impact Story</span>
                    </Button>

                    <SelectBlogPostModal
                      organization={organization}
                      show={isSelectBlogPostModalShown}
                      onHide={() => setIsSelectBlogPostModalShown(false)}
                      onSelect={handleAttachBlogPost}
                    />
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
