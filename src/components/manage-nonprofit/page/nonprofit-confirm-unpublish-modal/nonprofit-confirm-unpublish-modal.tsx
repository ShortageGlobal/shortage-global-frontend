import animationStyles from 'styles/animations.module.scss';
import { useState, useCallback } from 'react';
import { Modal, Alert, Button } from 'react-bootstrap';
import { Edit, Loader } from 'react-feather';
import {
  useAppDispatch,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { unpublishAccountOrganization } from 'core/api';
import { patchOrganization } from 'core/store/slices/account-organization';
import type { AccountOrganization } from 'core/api/types';

type NonprofitConfirmUnpublishModalProps = {
  organization: AccountOrganization;
  show: boolean;
  onHide: () => void;
};

export function NonprofitConfirmUnpublishModal({
  organization,
  show,
  onHide,
}: NonprofitConfirmUnpublishModalProps) {
  const dispatch = useAppDispatch();
  const { showNotification } = useNotifications();
  const [isPending, setIsPending] = useState(false);

  const getDeleteAccountNonprofitCancelToken = useCancelToken();

  const handleNonprofitDelete = useCallback(async () => {
    if (isPending) {
      return;
    }

    const cancelToken = getDeleteAccountNonprofitCancelToken();
    setIsPending(true);

    try {
      const response = await unpublishAccountOrganization({
        organizationSlug: organization.slug,
        cancelToken,
      });

      dispatch(patchOrganization(response.data));
      showNotification({
        isSuccess: true,
        message: 'Nonprofit page made draft successfully',
      });
      onHide();
    } catch (rejection) {
      if (isRequestCancel(rejection)) {
        return;
      }
      setIsPending(false);
      showNotification({
        isFailure: true,
        message:
          rejection?.response?.data?.details || 'Failed to unpublish the page',
      });
    }
  }, [setIsPending]);

  const handleOnExit = useCallback(() => {
    setIsPending(false);
  }, []);

  return (
    <Modal
      show={show}
      onHide={onHide}
      onExit={handleOnExit}
      aria-labelledby="unpublish-nonprofit-modal-title"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="unpublish-nonprofit-modal-title">
          Are you sure?
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="warning">
          {organization?.is_verified ? (
            <span>
              Donors will not be able to see your page and send you donations.
              You will have to go through the verification process again.
            </span>
          ) : (
            <span>
              Verification process will be postponed until you publish the page
              again.
            </span>
          )}
        </Alert>
        <div>
          Are you sure you want to return the{' '}
          <b>&quot;{organization.name}&quot;</b> page back into the draft state?
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={handleNonprofitDelete}
          variant="warning"
          disabled={isPending}
        >
          {isPending ? (
            <Loader
              size="1rem"
              role="status"
              aria-hidden="true"
              className={animationStyles.rotate}
            />
          ) : (
            <Edit size="1rem" aria-hidden="true" />
          )}
          <span>Back to draft</span>
        </Button>

        <Button onClick={onHide} variant="outline-dark">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
