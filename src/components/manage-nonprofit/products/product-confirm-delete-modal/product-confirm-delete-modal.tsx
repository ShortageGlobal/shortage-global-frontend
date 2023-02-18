import animationStyles from 'styles/animations.module.scss';
import { useState, useCallback } from 'react';
import { Modal, Alert, Button } from 'react-bootstrap';
import { Loader, Trash2 } from 'react-feather';
import { useRouter } from 'next/router';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import { deleteAccountOrganizationProduct } from 'core/api';
import type { AccountOrganization, AccountProduct } from 'core/api/types';

type ProductConfirmDeleteModalProps = {
  organization: AccountOrganization;
  product: AccountProduct;
  show: boolean;
  onHide: () => void;
};

export function ProductConfirmDeleteModal({
  organization,
  product,
  show,
  onHide,
}: ProductConfirmDeleteModalProps) {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [isPending, setIsPending] = useState(false);

  const getDeleteAccountProductCancelToken = useCancelToken();

  const handleProductDelete = useCallback(async () => {
    if (isPending) {
      return;
    }

    const cancelToken = getDeleteAccountProductCancelToken();
    setIsPending(true);

    try {
      await deleteAccountOrganizationProduct({
        organizationSlug: organization.slug,
        productId: product.id,
        cancelToken,
      });

      // redirect to the products list
      router.push({
        pathname:
          '/private/manage-nonprofit/[organizationSlug]/requested-goods/',
        query: { organizationSlug: organization.slug },
      });

      showNotification({
        isSuccess: true,
        message: 'Requested item deleted successfully',
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
          'Failed to delete requested item',
      });
    }
  }, [product, setIsPending]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="delete-product-modal-title"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="delete-product-modal-title">Are you sure?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="danger">This action can&apos;t be reverted.</Alert>
        <div>
          Are you sure you want to delete the <b>&quot;{product.name}&quot;</b>{' '}
          request?
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={handleProductDelete}
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
