import animationStyles from 'styles/animations.module.scss';
import { useState, useCallback } from 'react';
import { Modal, Alert, Button } from 'react-bootstrap';
import { Loader, Trash2 } from 'react-feather';
import { useRouter } from 'next/router';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import { deleteAccountOrganizationCampaign } from 'core/api';
import type { AccountOrganization, AccountCampaign } from 'core/api/types';

type CampaignConfirmDeleteModalProps = {
  organization: AccountOrganization;
  campaign: AccountCampaign;
  show: boolean;
  onHide: () => void;
};

export function CampaignConfirmDeleteModal({
  organization,
  campaign,
  show,
  onHide,
}: CampaignConfirmDeleteModalProps) {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [isPending, setIsPending] = useState(false);

  const getDeleteAccountCampaignCancelToken = useCancelToken();

  const handleCampaignDelete = useCallback(async () => {
    if (isPending) {
      return;
    }

    const cancelToken = getDeleteAccountCampaignCancelToken();
    setIsPending(true);

    try {
      await deleteAccountOrganizationCampaign({
        organizationSlug: organization.slug,
        campaignUuid: campaign.uuid,
        cancelToken,
      });

      // redirect to the campaigns list
      router.push({
        pathname: '/private/manage-nonprofit/[organizationSlug]/campaigns/',
        query: { organizationSlug: organization.slug },
      });

      showNotification({
        isSuccess: true,
        message: 'Campaign deleted successfully',
      });
    } catch (rejection) {
      if (isRequestCancel(rejection)) {
        return;
      }
      setIsPending(false);
      showNotification({
        isFailure: true,
        message:
          rejection?.response?.data?.details || 'Failed to delete Campaign',
      });
    }
  }, [campaign, setIsPending]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="delete-campaign-modal-title"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="delete-campaign-modal-title">
          Are you sure?
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="warning">This action cannot be undone.</Alert>
        <div>
          Are you sure you want to delete the <b>&quot;{campaign.name}&quot;</b>{' '}
          Campaign?
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={handleCampaignDelete}
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
