import animationStyles from 'styles/animations.module.scss';
import { useState, useCallback } from 'react';
import { Modal, Alert, Button } from 'react-bootstrap';
import { Loader, Trash2 } from 'react-feather';
import { useRouter } from 'next/router';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import { deleteAccountOrganizationBlogPost } from 'core/api';
import type { AccountOrganization, AccountBlogPost } from 'core/api/types';

type BlogPostConfirmDeleteModalProps = {
  organization: AccountOrganization;
  blogPost: AccountBlogPost;
  show: boolean;
  onHide: () => void;
};

export function BlogPostConfirmDeleteModal({
  organization,
  blogPost,
  show,
  onHide,
}: BlogPostConfirmDeleteModalProps) {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [isPending, setIsPending] = useState(false);

  const getDeleteAccountBlogPostCancelToken = useCancelToken();

  const handleBlogPostDelete = useCallback(async () => {
    if (isPending) {
      return;
    }

    const cancelToken = getDeleteAccountBlogPostCancelToken();
    setIsPending(true);

    try {
      await deleteAccountOrganizationBlogPost({
        organizationSlug: organization.slug,
        blogPostUuid: blogPost.uuid,
        cancelToken,
      });

      // redirect to the blogPosts list
      router.push({
        pathname:
          '/private/manage-nonprofit/[organizationSlug]/impact-stories/',
        query: { organizationSlug: organization.slug },
      });

      showNotification({
        isSuccess: true,
        message: 'Impact story deleted successfully',
      });
    } catch (rejection) {
      if (isRequestCancel(rejection)) {
        return;
      }
      setIsPending(false);
      showNotification({
        isFailure: true,
        message:
          rejection?.response?.data?.details || 'Failed to delete impact story',
      });
    }
  }, [blogPost, setIsPending]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="delete-blogPost-modal-title"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="delete-blogPost-modal-title">
          Are you sure?
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="danger">This action can&apos;t be reverted.</Alert>
        <div>
          Are you sure you want to delete the{' '}
          <b>&quot;{blogPost.title}&quot;</b> impact story?
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={handleBlogPostDelete}
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
