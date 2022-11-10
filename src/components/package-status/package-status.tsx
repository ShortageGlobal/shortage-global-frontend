import styles from './package-status.module.scss';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as gtm from 'core/tracking/gtm';
import { useAppSelector, useCart } from 'core/hooks';
import { selectOrganization } from 'core/store/slices/organization';
import { selectPackage } from 'core/store/slices/package';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
  getPackageStatusCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { PackageStatusVisualization } from 'components/package-status-visualization/package-status-visualization';
import { PACKAGE_TYPE } from 'core/constants';
import { ProceedToDonationButton } from 'components/proceed-to-donation-button/proceed-to-donation-button';

export function PackageStatus() {
  const router = useRouter();

  const { organization } = useAppSelector(selectOrganization);
  const packageState = useAppSelector(selectPackage);

  const { isCartReady, cart, deleteFromCart } = useCart();

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
        organizationSlug: organization.slug,
        items: cartItems.map((cartItem) => ({
          productSlug: cartItem.product.slug,
          productPrice: cartItem.product.price,
          quantity: cartItem.quantity,
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

                {packageState.package.delivery_company &&
                packageState.package.tracking_code ? (
                  <>
                    <header className={styles.sectionHeader}>
                      <h5>Package Details</h5>
                    </header>

                    <dl className={styles.packageDetails}>
                      <dt>Shipping Carrier</dt>
                      <dd>{packageState.package.delivery_company}</dd>
                      <dt>Tracking number</dt>
                      <dd>{packageState.package.tracking_code}</dd>
                    </dl>
                  </>
                ) : null}

                <PackageStatusVisualization package={packageState.package} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
