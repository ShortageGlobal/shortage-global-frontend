import animationStyles from 'styles/animations.module.scss';
import { useState, useCallback } from 'react';
import { Modal, Alert, Button } from 'react-bootstrap';
import { Loader, Trash2 } from 'react-feather';
import { useRouter } from 'next/router';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import { deleteAccountOrganization } from 'core/api';
import type { AccountOrganization } from 'core/api/types';

type NonprofitConfirmDeleteModalProps = {
  organization: AccountOrganization;
  show: boolean;
  onHide: () => void;
};

export function NonprofitConfirmDeleteModal({
  organization,
  show,
  onHide,
}: NonprofitConfirmDeleteModalProps) {
  const router = useRouter();
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
      await deleteAccountOrganization({
        organizationSlug: organization.slug,
        cancelToken,
      });

      // redirect to the root
      router.push({
        pathname: '/',
      });

      showNotification({
        isSuccess: true,
        message: 'Nonprofit page deleted successfully',
      });
    } catch (rejection) {
      if (isRequestCancel(rejection)) {
        return;
      }
      setIsPending(false);
      showNotification({
        isFailure: true,
        message:
          rejection?.response?.data?.details ||
          'Failed to delete nonprofit page',
      });
    }
  }, [setIsPending]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="delete-nonprofit-modal-title"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="delete-nonprofit-modal-title">
          Are you sure?
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="danger">
          This action cannot be undone. All data will be lost.
        </Alert>
        <div>
          Are you sure you want to delete the{' '}
          <b>&quot;{organization.name}&quot;</b> page?
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={handleNonprofitDelete}
          variant="danger"
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
            <Trash2 size="1rem" aria-hidden="true" />
          )}
          <span>Delete</span>
        </Button>

        <Button onClick={onHide} variant="outline-dark">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
