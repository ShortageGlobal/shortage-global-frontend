import styles from './package-status.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Alert, Button, Form } from 'react-bootstrap';
import { FileText, Loader } from 'react-feather';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as gtm from 'core/tracking/gtm';
import {
  useAppDispatch,
  useAppSelector,
  useCart,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { selectOrganization } from 'core/store/slices/organization';
import { fetchPackage, selectPackage } from 'core/store/slices/package';
import { selectPackageBlogPosts } from 'core/store/slices/package-blog-posts';
import { updatePackageNote } from 'core/api';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
  getPackageStatusCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { PackageStatusVisualization } from 'components/package-status-visualization/package-status-visualization';
import { PackageLogs } from 'components/package-logs/package-logs';
import { ProceedToDonationButton } from 'components/proceed-to-donation-button/proceed-to-donation-button';
import { PACKAGE_TYPE } from 'core/constants';
import type { FormEvent } from 'react';
import { BlogPostCard } from 'components/blog-post-card/blog-post-card';

export function PackageStatus() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { organization } = useAppSelector(selectOrganization);
  const packageState = useAppSelector(selectPackage);
  const packageBlogPosts = useAppSelector(selectPackageBlogPosts);
  const [isNotePending, setIsNotePending] = useState(false);

  console.log(packageBlogPosts);

  const { isCartReady, cart, deleteFromCart } = useCart();
  const { showNotification } = useNotifications();

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getOrganizationCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getPackageStatusCrumb({
        organizationSlug: organization.slug,
        packageId: packageState.package?.uuid,
        isActive: true,
      }),
    ];
  }, [organization]);

  const hasOtherCartItems = useMemo(() => {
    const cartItemIdsToDelete = router.query?.dci || [];
    return (
      isCartReady &&
      cart.items.filter(
        (cartItem) => !cartItemIdsToDelete.includes(cartItem.uuid)
      ).length > 0
    );
  }, [isCartReady, cart, router]);

  // detect "dci" query parameters and delete corresponding cart items
  useEffect(() => {
    if (isCartReady && router.query?.dci) {
      const cartItemIds = Array.isArray(router.query.dci)
        ? router.query.dci
        : [router.query.dci];

      // form data for tracking
      const cartItems = cart.items.filter((cartItem) =>
        cartItemIds.includes(cartItem.uuid)
      );

      // send request to remove cart items
      (async function () {
        try {
          await Promise.all(
            cartItemIds.map((cartItemId) => deleteFromCart({ cartItemId }))
          );
        } catch (rejection) {
          // ignore failure. So what the item might have been already deleted or is fake?
        }
      })();

      // remove "dci" from query params
      const queryParams = { ...router.query };
      delete queryParams.dci;

      router.replace(
        { query: queryParams },
        undefined,
        { shallow: true } // do not run getServerSideProps
      );

      gtm.trackPackageRegistraionSuccess({
        packageId: packageState.package.uuid,
        organizationSlug: organization.slug,
        organizationName: organization.name,
        items: cartItems.map((cartItem) => ({
          productSlug: cartItem.product.slug,
          productName: cartItem.product.name,
          productPrice: cartItem.product.price,
          quantity: cartItem.quantity,
          organizationSlug: cartItem.product.organization.slug,
        })),
        totalPrice: cartItems.reduce((result, cartItem) => {
          result += cartItem.quantity * cartItem.product.price;
          return result;
        }, 0),
      });
    }
  }, [isCartReady, router.query?.dci]);

  // for funded donations
  const [showPaymentSucceededAlert, setShowPaymentSucceededAlert] = useState(
    () =>
      router.query?.paymentStatus === 'succeeded' &&
      packageState.package.type === PACKAGE_TYPE.FUNDED_BY_DONOR
  );

  const [showRegistrationSucceededAlert, setShowRegistrationSucceededAlert] =
    useState(
      () =>
        router.query?.registrationStatus === 'succeeded' &&
        packageState.package.type === PACKAGE_TYPE.SENT_BY_DONOR
    );

  const handleDismissPaymentSucceededAlert = useCallback(() => {
    setShowPaymentSucceededAlert(false);

    // remove "paymentStatus" from query params
    const queryParams = { ...router.query };
    delete queryParams.paymentStatus;

    router.replace(
      { query: queryParams },
      undefined,
      { shallow: true } // do not run getServerSideProps
    );
  }, [router]);

  const handleDismissRegistrationSucceededAlert = useCallback(() => {
    setShowRegistrationSucceededAlert(false);

    // remove "registrationStatus" from query params
    const queryParams = { ...router.query };
    delete queryParams.registrationStatus;

    router.replace(
      { query: queryParams },
      undefined,
      { shallow: true } // do not run getServerSideProps
    );
  }, [router]);

  const getSubmitNoteCancelToken = useCancelToken();
  const handleSubmitNote = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isNotePending) {
        return;
      }

      const target = e.target as typeof e.target & {
        note: HTMLTextAreaElement;
      };
      const note = target.note.value;

      setIsNotePending(true);
      const cancelToken = getSubmitNoteCancelToken();

      try {
        gtm.trackPackageLeaveNote();
        // post a note
        await updatePackageNote({
          organizationSlug: organization.slug,
          packageId: packageState.package.uuid,
          note,
          cancelToken,
        });

        // refetch package
        await dispatch(
          fetchPackage({
            organizationSlug: organization.slug,
            packageId: packageState.package.uuid,
          })
        );

        showNotification({
          isSuccess: true,
          message: 'Note saved',
        });

        target.note.value = '';
        setIsNotePending(false);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        let errorMessage = `Failed to save a note.`;
        if (rejection?.response?.data?.details) {
          errorMessage = `${errorMessage} ${rejection?.response?.data?.details}`;
        }
        showNotification({
          isFailure: true,
          message: errorMessage,
        });
        setIsNotePending(false);
      }
    },
    [isNotePending, organization, packageState]
  );

  const otherCartItemsAction = hasOtherCartItems ? (
    <>
      <div>Also, there are other items in your cart. </div>
      <div className={styles.donateButton}>
        <ProceedToDonationButton />
      </div>
    </>
  ) : null;

  return (
    <>
      <Head>
        <title>Donation Status | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col className={styles.packageStatus}>
            {showPaymentSucceededAlert ? (
              <Row>
                <Col>
                  <Alert
                    variant="success"
                    className={styles.successAlert}
                    onClose={handleDismissPaymentSucceededAlert}
                    dismissible
                  >
                    <Alert.Heading>
                      <span>Thank you for your donation</span>
                    </Alert.Heading>
                    <div className={styles.body}>
                      <div>
                        The payment is being processed. You can track the status
                        of your donation on this page. The confirmation email
                        will be in your inbox shortly.
                      </div>

                      {otherCartItemsAction}
                    </div>
                  </Alert>
                </Col>
              </Row>
            ) : null}

            {showRegistrationSucceededAlert ? (
              <Row>
                <Col>
                  <Alert
                    variant="success"
                    className={styles.successAlert}
                    onClose={handleDismissRegistrationSucceededAlert}
                    dismissible
                  >
                    <Alert.Heading>
                      <span>Thank you for your donation</span>
                    </Alert.Heading>
                    <div className={styles.body}>
                      <div>
                        We have received your donation details. You can track
                        the status of your donation on this page. The
                        confirmation email will be in your inbox shortly.
                      </div>

                      {otherCartItemsAction}
                    </div>
                  </Alert>
                </Col>
              </Row>
            ) : null}

            <Row>
              <Col>
                <header>
                  <h2 className={styles.header}>Donation Status</h2>
                </header>
              </Col>
            </Row>

            <Row>
              <Col>
                <p className="text-center">Thank you for helping 💚</p>

                {/* Tracking details */}
                {packageState.package.delivery_company &&
                packageState.package.tracking_code ? (
                  <>
                    <header className={styles.sectionHeader}>
                      <h5>Package Details</h5>
                    </header>

                    <dl className={styles.packageDetails}>
                      <dt>Shipping Carrier</dt>
                      <dd>{packageState.package.delivery_company}</dd>
                      <dt>Tracking Number</dt>
                      <dd>{packageState.package.tracking_code}</dd>
                    </dl>
                  </>
                ) : null}

                {/* Status Visualization */}
                <PackageStatusVisualization
                  package={packageState.package}
                  className={styles.packageStatusVisualization}
                />

                {/* Logs */}
                <PackageLogs
                  organizationSlug={organization.slug}
                  donation={packageState.package}
                />

                {/* Tax Deduction */}
                {packageState.package.tax_deduction_receipt &&
                packageState.package.need_tax_deduction ? (
                  <dl className={styles.taxDeductionBlock}>
                    <dt>Tax deduction receipt</dt>
                    <dd>
                      <Button
                        size="lg"
                        href={packageState.package.tax_deduction_receipt}
                        variant="outline-dark"
                        className={styles.seeTaxDeductionReceiptBtn}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FileText />
                        <span>See the tax deduction receipt</span>
                      </Button>
                    </dd>
                  </dl>
                ) : null}

                {/* Note */}
                <div className={styles.noteBlock}>
                  {packageState.package.note ? (
                    <dl className={styles.packageDetails}>
                      <dt>Note from the donor</dt>
                      <dd>{packageState.package.note}</dd>
                    </dl>
                  ) : null}
                  <header className={styles.sectionHeader}>
                    <h5>Would you like to add a short note to your gift?</h5>
                  </header>

                  <Form onSubmit={handleSubmitNote}>
                    <Form.Group controlId="note" className={styles.formGroup}>
                      <Form.Control
                        size="lg"
                        as="textarea"
                        name="note"
                        placeholder="Leave a note"
                        className={styles.noteTextarea}
                        disabled={isNotePending}
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isNotePending}
                      variant="outline-dark"
                      className={styles.submitNoteBtn}
                    >
                      {isNotePending ? (
                        <Loader
                          role="status"
                          aria-hidden="true"
                          className={animationStyles.rotate}
                        />
                      ) : null}
                      <span>Submit</span>
                    </Button>
                  </Form>
                </div>

                {/* My Impact */}
                {packageBlogPosts.packageBlogPosts?.length > 0 ? (
                  <div className={styles.myImpactBlock}>
                    <header className={styles.sectionHeader}>
                      <h5>My Impact</h5>
                    </header>

                    <div className={styles.blogPosts}>
                      {packageBlogPosts.packageBlogPosts.map((blogPost) => {
                        return (
                          <BlogPostCard
                            key={blogPost.slug}
                            blogPost={blogPost}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
