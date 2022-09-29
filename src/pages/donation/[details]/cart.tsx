import styles from 'styles/pages/donation-cart.module.scss';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { wrapper } from 'app/store';
import {
  useAppDispatch,
  useAppSelector,
  useCart,
  useCancelToken,
} from 'app/hooks';
import { fetchInstructions } from 'app/store/slices/instructions';
import { selectInstructions } from 'app/store/slices/instructions';
import { groupCartItemsByOrganization } from 'app/helpers';
import {
  Breadcrumbs,
  getHomeCrumb,
  getDonationDetailsCrumb,
  getDonationCartCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { InstructionsModal } from 'components/instructions-modal/instructions-modal';
import { WeAreHereForYou } from 'components/we-are-here-for-you/we-are-here-for-you';
import { PAGE_KEY } from 'app/constants';
import type { NextPageWithLayout } from 'pages/_app';

const DonationCart: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { cart, isCartReady, isDonationDetailsFilled } = useCart();
  const { instructions, isInstructionsLoading } =
    useAppSelector(selectInstructions);

  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getDonationDetailsCrumb(),
      getDonationCartCrumb({ isActive: true }),
    ];
  }, []);

  const groupedCartItems = useMemo(() => {
    return groupCartItemsByOrganization({ items: cart?.items });
  }, [cart?.items]);

  const shouldRedirect = useMemo(() => {
    return isCartReady && !isDonationDetailsFilled;
  }, [isCartReady, isDonationDetailsFilled]);

  const shouldShowContent = useMemo(() => {
    return (
      !shouldRedirect && instructions !== null && groupedCartItems.size > 0
    );
  }, [shouldRedirect, instructions, groupedCartItems]);

  const shouldShowNoItemsMessage = useMemo(() => {
    return (
      !shouldRedirect &&
      !shouldShowContent &&
      isCartReady &&
      groupedCartItems.size === 0
    );
  }, [shouldRedirect, shouldShowContent, isCartReady, groupedCartItems]);

  const shouldShowLoadingMessage = useMemo(() => {
    return !shouldRedirect && !shouldShowContent && !shouldShowNoItemsMessage;
  }, [shouldRedirect, shouldShowContent, shouldShowNoItemsMessage]);

  // TODO: HARDCODE! Add support for multiple organizations in cart
  const firstOrganization = useMemo(() => {
    return Array.from(groupedCartItems.values())[0];
  }, [groupedCartItems]);
  const organizationInstructions = useMemo(() => {
    return instructions?.[firstOrganization?.organizationSlug];
  }, [instructions, firstOrganization]);

  // redirect to Donation Details if they aren't filled yet
  useEffect(() => {
    if (shouldRedirect) {
      router.push({
        pathname: '/donation/details',
        query: {
          showDonationDetailsAlert: true,
          next: PAGE_KEY.DONATION_CART,
        },
      });
    }
  }, [shouldRedirect]);

  // fetch instructions
  const getFetchInstructionsCancelToken = useCancelToken();
  useEffect(() => {
    if (
      !isCartReady ||
      !isDonationDetailsFilled ||
      isInstructionsLoading ||
      instructions !== null
    ) {
      return;
    }
    const organizationSlugs = Array.from(groupedCartItems.keys());
    const cancelToken = getFetchInstructionsCancelToken();
    dispatch(fetchInstructions({ organizationSlugs, cancelToken }));
  }, [isCartReady, isDonationDetailsFilled, groupedCartItems, instructions]);

  const handleFundDonation = useCallback(() => {
    //
  }, []);

  const handleShowInstructionsModal = useCallback(() => {
    setShowInstructionsModal(true);
  }, []);

  const handleHideInstructionsModal = useCallback(() => {
    setShowInstructionsModal(false);
  }, []);

  const handleTangibleDonation = useCallback(() => {
    handleShowInstructionsModal();
  }, []);

  return (
    <>
      <Head>
        <title>Donation Cart | Shortage</title>
      </Head>

      <Container>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      {/* TODO: placeholder for "isCartReady" */}

      <Container className={styles.mainContent}>
        <Row>
          <Col className={styles.donationCartCol}>
            <h2>Cart</h2>

            {shouldRedirect ? (
              <div className={styles.loadingMessage}>
                <Spinner animation="border" role="status"></Spinner>
                <span>
                  Redirecting to{' '}
                  <Link
                    href={{
                      pathname: '/donation/details',
                      query: {
                        showDonationDetailsAlert: true,
                        next: PAGE_KEY.DONATION_CART,
                      },
                    }}
                  >
                    <a>Donation Details</a>
                  </Link>
                </span>
              </div>
            ) : null}

            {shouldShowLoadingMessage ? (
              <div className={styles.loadingMessage}>
                <Spinner animation="border" role="status"></Spinner>
                <span>Loading data...</span>
              </div>
            ) : null}

            {shouldShowNoItemsMessage ? (
              <p className={styles.noItemsMessage}>
                Your donation cart doesn&apos;t have any goods. Check the
                requested goods on{' '}
                <Link href={{ pathname: '/' }}>
                  <a>the homepage</a>
                </Link>
                .
              </p>
            ) : null}

            {shouldShowContent ? (
              <>
                <div>
                  <h4 className={styles.sectionHeader}>
                    How would you like to donate?
                  </h4>
                  <Row>
                    {/* Fund donation option */}
                    <Col sm={6} className={styles.donationOptionButtonCol}>
                      <button
                        onClick={handleFundDonation}
                        className={styles.donationOptionButton}
                      >
                        <Image
                          alt=""
                          src="/images/donation-cart/donation-fund.svg"
                          width={50}
                          height={50}
                        />
                        <p>We&apos;ll buy the selected goods on your behalf</p>
                        <Button as="span" size="lg" tabIndex={-1}>
                          Fund Donation
                        </Button>
                      </button>
                    </Col>

                    {/* Send what donor has option */}
                    <Col sm={6} className={styles.donationOptionButtonCol}>
                      <button
                        onClick={handleTangibleDonation}
                        className={styles.donationOptionButton}
                      >
                        <Image
                          alt=""
                          src="/images/donation-cart/donation-package.svg"
                          width={50}
                          height={50}
                        />
                        <p>We&apos;ll provide delivery instructions</p>
                        <Button as="span" size="lg" tabIndex={-1}>
                          Donate what I have
                        </Button>
                      </button>
                    </Col>
                  </Row>
                </div>
              </>
            ) : null}
          </Col>
        </Row>
      </Container>

      <WeAreHereForYou />

      {organizationInstructions?.length > 0 ? (
        <InstructionsModal
          show={showInstructionsModal}
          organizationSlug={firstOrganization?.organizationSlug}
          organizationName={firstOrganization?.organizationName}
          instructions={organizationInstructions}
          onHide={handleHideInstructionsModal}
        />
      ) : null}
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {},
  };
});

export default DonationCart;
