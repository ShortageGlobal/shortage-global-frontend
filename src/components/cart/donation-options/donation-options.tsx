import styles from './donation-options.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useCallback, useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { DollarSign, Loader, Package } from 'react-feather';
import classNames from 'classnames';
import {
  useAppSelector,
  useCart,
  useCancelToken,
  isRequestCancel,
} from 'app/hooks';
import { selectInstructions } from 'app/store/slices/instructions';
import { createPackage } from 'app/api';
import { InstructionsModal } from 'components/instructions-modal/instructions-modal';
import * as fbq from 'app/tracking/fpixel';
import { PACKAGE_TYPE } from 'app/constants';
import type { CartGroup } from 'app/helpers';

type DonationOptionsProps = {
  cartGroup: CartGroup;
};

export function DonationOptions({ cartGroup }: DonationOptionsProps) {
  const { cart } = useCart();
  const { instructions } = useAppSelector(selectInstructions);

  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [isPackageBeingCreated, setIsPackageBeingCreated] = useState(false);

  const getCreatePackageCancelToken = useCancelToken();

  const organizationInstructions = useMemo(() => {
    return instructions?.[cartGroup.organizationSlug];
  }, [instructions, cartGroup]);

  const handleFundDonation = useCallback(async () => {
    const cancelToken = getCreatePackageCancelToken();
    setIsPackageBeingCreated(true);
    fbq.custom('ClickOrderItems', {
      organization_slug: cartGroup.organizationSlug,
      items: cartGroup.items.map((item) => {
        return {
          product: item.product.slug,
          quantity: item.quantity,
        };
      }),
    });
    try {
      const response = await createPackage({
        type: PACKAGE_TYPE.FUNDED_BY_DONOR,
        organizationSlug: cartGroup.organizationSlug,
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
        items: cartGroup.items.map((item) => {
          return {
            product: item.product.slug,
            quantity: item.quantity,
            cart_item_uuid: item.uuid,
          };
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
  }, [cartGroup, cart]);

  const handleShowInstructionsModal = useCallback(() => {
    setShowInstructionsModal(true);
  }, []);

  const handleHideInstructionsModal = useCallback(() => {
    setShowInstructionsModal(false);
  }, []);

  const handleTangibleDonation = useCallback(() => {
    fbq.custom('ClickDonateWhatIHave', {
      organization_slug: cartGroup.organizationSlug,
      items: cartGroup.items.map((item) => {
        return {
          product: item.product.slug,
          quantity: item.quantity,
        };
      }),
    });
    handleShowInstructionsModal();
  }, [cartGroup]);

  return (
    <>
      <div className={styles.donationOptions}>
        {/* Order items option */}
        <Button
          size="lg"
          className={styles.button}
          onClick={handleFundDonation}
          disabled={isPackageBeingCreated}
        >
          {isPackageBeingCreated ? (
            <Loader
              role="status"
              aria-hidden="true"
              className={classNames(animationStyles.rotate, styles.buttonGlyph)}
            />
          ) : (
            <DollarSign className={styles.buttonGlyph} />
          )}
          <span>
            {cartGroup.items.length > 1 ? 'Order items' : 'Order item'}
          </span>
        </Button>

        {/* Separator */}
        <div className={styles.separator}>
          <span>OR</span>
        </div>

        {/* Send what donor has option */}
        <Button
          size="lg"
          className={styles.button}
          onClick={handleTangibleDonation}
        >
          <Package className={styles.buttonGlyph} />
          <span>Donate what I have</span>
        </Button>
      </div>

      {organizationInstructions?.length > 0 ? (
        <InstructionsModal
          show={showInstructionsModal}
          organizationSlug={cartGroup.organizationSlug}
          organizationName={cartGroup.organizationName}
          instructions={organizationInstructions}
          onHide={handleHideInstructionsModal}
        />
      ) : null}
    </>
  );
}
