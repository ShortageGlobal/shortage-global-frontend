import styles from './donation-options.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useCallback, useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import Image from 'next/image';
import {
  useAppSelector,
  useCart,
  useCancelToken,
  isRequestCancel,
} from 'app/hooks';
import { selectInstructions } from 'app/store/slices/instructions';
import { createPackage } from 'app/api';
import { InstructionsModal } from 'components/instructions-modal/instructions-modal';
import { groupCartItemsByOrganization } from 'app/helpers';
import { PACKAGE_TYPE } from 'app/constants';

type DonationOptionsProps = {
  groupedCartItems: ReturnType<typeof groupCartItemsByOrganization>;
};

export function DonationOptions({ groupedCartItems }: DonationOptionsProps) {
  const { cart } = useCart();
  const { instructions } = useAppSelector(selectInstructions);

  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [isPackageBeingCreated, setIsPackageBeingCreated] = useState(false);

  const getCreatePackageCancelToken = useCancelToken();

  // TODO: HARDCODE! Add support for multiple organizations in cart
  const firstOrganization = useMemo(() => {
    return Array.from(groupedCartItems.values())[0];
  }, [groupedCartItems]);
  const organizationInstructions = useMemo(() => {
    return instructions?.[firstOrganization?.organizationSlug];
  }, [instructions, firstOrganization]);

  const handleFundDonation = useCallback(async () => {
    const cancelToken = getCreatePackageCancelToken();
    setIsPackageBeingCreated(true);
    try {
      const response = await createPackage({
        type: PACKAGE_TYPE.FUNDED_BY_DONOR,
        organizationSlug: firstOrganization.organizationSlug,
        firstName: cart.first_name,
        lastName: cart.last_name,
        email: cart.email,
        phoneNumber: cart.phone_number,
        needTaxDeduction: cart.need_tax_deduction,
        addressLine1: cart.address_line1,
        addressLine2: cart.address_line2,
        city: cart.city,
        stateProvinceRegion: cart.state_province_region,
        zip: cart.zip,
        country: cart.country,
        items: groupedCartItems
          .get(firstOrganization.organizationSlug)
          .items.map((item) => {
            return { product: item.product.slug, quantity: item.quantity };
          }),
        cancelToken,
      });
      // redirect to the checkout page
      window.open(response.data.checkout_url, '_self');
    } catch (rejection) {
      if (isRequestCancel(rejection)) {
        return;
      }
      setIsPackageBeingCreated(false);
    }
  }, [firstOrganization, cart, groupedCartItems]);

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
      <div className={styles.donationOptions}>
        {/* Fund donation option */}
        <button
          onClick={handleFundDonation}
          className={styles.donationOptionButton}
          disabled={isPackageBeingCreated}
        >
          <div className={styles.donationOptionGlyph}>
            <Image
              alt=""
              src="/images/donation-cart/donation-fund.svg"
              width={50}
              height={50}
            />
          </div>
          <p>We&apos;ll buy the selected goods on your behalf</p>
          <Button as="span" size="lg" tabIndex={-1} className={styles.button}>
            {isPackageBeingCreated ? (
              <Loader
                role="status"
                aria-hidden="true"
                className={animationStyles.rotate}
              />
            ) : null}
            <span>Fund Donation</span>
          </Button>
        </button>

        <div className={styles.donationOptionsSeparator}>
          <span>OR</span>
        </div>

        {/* Send what donor has option */}
        <button
          onClick={handleTangibleDonation}
          className={styles.donationOptionButton}
        >
          <div className={styles.donationOptionGlyph}>
            <Image
              alt=""
              src="/images/donation-cart/donation-package.svg"
              width={50}
              height={50}
            />
          </div>
          <p>We&apos;ll provide delivery instructions</p>
          <Button as="span" size="lg" tabIndex={-1} className={styles.button}>
            Donate what I have
          </Button>
        </button>
      </div>

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
}
