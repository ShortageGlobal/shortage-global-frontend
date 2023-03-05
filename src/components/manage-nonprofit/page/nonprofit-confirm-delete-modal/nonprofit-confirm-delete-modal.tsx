import animationStyles from 'styles/animations.module.scss';
import { useState, useCallback, useMemo } from 'react';
import { Modal, Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { AlertOctagon, Check, Loader, Trash2 } from 'react-feather';
import { useRouter } from 'next/router';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import { deleteAccountOrganization } from 'core/api';
import type { AccountOrganization } from 'core/api/types';

type NonprofitConfirmDeleteModalProps = {
  organization: AccountOrganization;
  show: boolean;
  onHide: () => void;
};

const CONFIRM_VALUE = 'confirm';

export function NonprofitConfirmDeleteModal({
  organization,
  show,
  onHide,
}: NonprofitConfirmDeleteModalProps) {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [isPending, setIsPending] = useState(false);
  const [confirmValue, setConfirmValue] = useState('');

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

  const canProceed = useMemo(() => {
    return confirmValue.toLowerCase() === CONFIRM_VALUE.toLowerCase();
  }, [confirmValue]);

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
          <b>&quot;{organization.name}&quot;</b> page and all associated data?
        </div>

        <div className="mt-4">
          <Form.Label htmlFor="confirm-delete-input">
            Type <strong>&quot;{CONFIRM_VALUE}&quot;</strong> to proceed
          </Form.Label>
          <InputGroup>
            <InputGroup.Text id="delete-confirm-icon">
              {canProceed ? (
                <Check size="1.25rem" />
              ) : (
                <AlertOctagon size="1.25rem" />
              )}
            </InputGroup.Text>
            <Form.Control
              type="text"
              required
              autoComplete="off"
              placeholder='type "confirm"'
              aria-describedby="delete-confirm-icon"
              id="confirm-delete-input"
              value={confirmValue}
              onChange={(e) => setConfirmValue(e.target.value)}
            />
          </InputGroup>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={handleNonprofitDelete}
          variant="danger"
          disabled={isPending || !canProceed}
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
