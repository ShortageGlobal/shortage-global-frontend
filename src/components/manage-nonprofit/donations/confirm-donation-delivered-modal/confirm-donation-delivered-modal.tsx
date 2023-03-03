import animationStyles from 'styles/animations.module.scss';
import { useState, useCallback } from 'react';
import { Modal, Alert, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import {
  useNotifications,
  useAppDispatch,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { markPackageAsDelivered } from 'core/api';
import { patchPackage } from 'core/store/slices/account-organization-package';
import type {
  AccountOrganization,
  AccountOrganizationPackage,
} from 'core/api/types';

type ConfirmDonationDeliveredModalProps = {
  organization: AccountOrganization;
  donation: AccountOrganizationPackage;
  show: boolean;
  onHide: () => void;
};

export function ConfirmDonationDeliveredModal({
  organization,
  donation,
  show,
  onHide,
}: ConfirmDonationDeliveredModalProps) {
  const dispatch = useAppDispatch();
  const { showNotification } = useNotifications();

  const [isPending, setIsPending] = useState(false);

  const getMarkAsDeliveredCancelToken = useCancelToken();

  const handleConfirm = useCallback(async () => {
    if (isPending) {
      return;
    }

    const cancelToken = getMarkAsDeliveredCancelToken();
    setIsPending(true);

    try {
      const response = await markPackageAsDelivered({
        organizationSlug: organization.slug,
        packageId: donation.uuid,
        cancelToken,
      });
      dispatch(patchPackage({ ...response.data }));
      showNotification({
        isSuccess: true,
        message: 'Donation is marked as delivered.',
      });
      onHide();
    } catch (rejection) {
      if (isRequestCancel(rejection)) {
        return;
      }
      setIsPending(false);
      const rejectionDetails = rejection?.response?.data?.details;
      let errorMessage = `Failed to mark the donation as delivered.`;
      if (rejectionDetails) {
        errorMessage = `${errorMessage} ${rejectionDetails}`;
      }
      showNotification({
        isFailure: true,
        message: errorMessage,
      });
      onHide();
    }
  }, [organization, donation, onHide]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="confirm-donation-delivered-modal-title"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="confirm-donation-delivered-modal-title">
          Mark donation as delivered
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="warning">This action cannot be undone.</Alert>
        <div>
          Are you sure you want to mark the donation as &quot;Delivered&quot;?
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleConfirm} variant="primary" disabled={isPending}>
          {isPending ? (
            <Loader
              size="1rem"
              role="status"
              aria-hidden="true"
              className={animationStyles.rotate}
            />
          ) : null}
          <span>Confirm</span>
        </Button>

        <Button onClick={onHide} variant="outline-dark">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
