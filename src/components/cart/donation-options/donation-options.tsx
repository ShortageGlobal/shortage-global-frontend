import styles from './donation-options.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useCallback, useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { DollarSign, Loader, Package } from 'react-feather';
import classNames from 'classnames';
import * as gtm from 'core/tracking/gtm';
import {
  useAppSelector,
  useCart,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { selectInstructions } from 'core/store/slices/instructions';
import { pluralize } from 'core/helpers';
import { createPackage } from 'core/api';
import { PACKAGE_TYPE } from 'core/constants';
import { InstructionsModal } from 'components/instructions-modal/instructions-modal';
import { Campaign, CartItem, Organization } from 'core/api/types';

type DonationOptionsProps = {
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  campaignSlug?: Campaign['slug'];
  campaignUuid?: Campaign['uuid'];
  campaignName?: Campaign['name'];
  items: CartItem[];
};

export function DonationOptions({
  organizationSlug,
  organizationName,
  campaignSlug,
  campaignUuid,
  campaignName,
  items,
}: DonationOptionsProps) {
  const { cart } = useCart();
  const { instructions } = useAppSelector(selectInstructions);

  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [isPackageBeingCreated, setIsPackageBeingCreated] = useState(false);

  const getCreatePackageCancelToken = useCancelToken();

  const organizationInstructions = useMemo(() => {
    return instructions?.[organizationSlug];
  }, [instructions, organizationSlug]);

  const handleFundDonation = useCallback(async () => {
    const cancelToken = getCreatePackageCancelToken();
    setIsPackageBeingCreated(true);
    gtm.trackClickOrderItems({
      organizationSlug,
      organizationName,
      campaignSlug,
      campaignUuid,
      campaignName,
      items: items.map((item) => {
        return {
          productSlug: item.product.slug,
          productName: item.product.name,
          productPrice: item.product.price,
          quantity: item.quantity,
          organizationSlug: item.product.organization.slug,
        };
      }),
      totalPrice: items.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
      }, 0),
    });
    try {
      const response = await createPackage({
        type: PACKAGE_TYPE.FUNDED_BY_DONOR,
        organizationSlug: organizationSlug,
        campaignUuid,
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
        items: items.map((item) => {
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
  }, [
    organizationSlug,
    organizationName,
    campaignSlug,
    campaignUuid,
    campaignName,
    items,
    cart,
  ]);

  const handleShowInstructionsModal = useCallback(() => {
    setShowInstructionsModal(true);
  }, []);

  const handleHideInstructionsModal = useCallback(() => {
    setShowInstructionsModal(false);
  }, []);

  const handleTangibleDonation = useCallback(() => {
    gtm.trackClickDonateWhatIHave({
      organizationSlug,
      organizationName,
      campaignSlug,
      campaignUuid,
      campaignName,
      items: items.map((item) => {
        return {
          productSlug: item.product.slug,
          productName: item.product.name,
          productPrice: item.product.price,
          quantity: item.quantity,
          organizationSlug: item.product.organization.slug,
        };
      }),
      totalPrice: items.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
      }, 0),
    });
    handleShowInstructionsModal();
  }, [
    organizationSlug,
    organizationName,
    campaignSlug,
    campaignUuid,
    campaignName,
    items,
  ]);

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
          <span>{pluralize(items.length, 'Order item', 'Order items')}</span>
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
          disabled={organizationInstructions?.length === 0}
        >
          <Package className={styles.buttonGlyph} />
          <span>Donate what I have</span>
        </Button>
      </div>

      {organizationInstructions?.length > 0 ? (
        <InstructionsModal
          show={showInstructionsModal}
          organizationSlug={organizationSlug}
          organizationName={organizationName}
          campaignSlug={campaignSlug}
          campaignUuid={campaignUuid}
          campaignName={campaignName}
          instructions={organizationInstructions}
          onHide={handleHideInstructionsModal}
        />
      ) : null}
    </>
  );
}
