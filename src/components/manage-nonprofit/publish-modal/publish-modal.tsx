import styles from './publish-modal.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useState, useMemo, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Modal, Button, Alert, Badge } from 'react-bootstrap';
import {
  AlertTriangle,
  Check,
  Loader,
  Minus,
  Send,
  XOctagon,
} from 'react-feather';
import Link from 'next/link';
import {
  useUser,
  useAppDispatch,
  useAppSelector,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import {
  fetchOrganizationPublishChecklist,
  publishAccountOrganization,
} from 'core/api';
import {
  selectAccountOrganization,
  patchOrganization,
} from 'core/store/slices/account-organization';
import { toggleLiveChat } from 'core/store/slices/live-chat';
import type { OrganizationChecklist } from 'core/api/types';

type PublishModalProps = {
  show: boolean;
  onHide: () => void;
};

export function PublishModal({ show, onHide }: PublishModalProps) {
  const dispatch = useAppDispatch();

  const { profile } = useUser();
  const { organization } = useAppSelector(selectAccountOrganization);

  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [checklistResponse, setChecklistResponse] =
    useState<OrganizationChecklist>(null);
  const [checklistCanPublish, setChecklistCanPublish] = useState(false);

  const getFetchChecklistCancelToken = useCancelToken();
  const getPublishCancelToken = useCancelToken();

  useEffect(() => {
    if (!show || !organization.is_draft) {
      return;
    }

    fetchChecklist();

    async function fetchChecklist() {
      const cancelToken = getFetchChecklistCancelToken();

      setIsLoading(true);

      try {
        const response = await fetchOrganizationPublishChecklist({
          organizationSlug: organization.slug,
          cancelToken,
        });

        setIsLoading(false);
        setChecklistCanPublish(response.data.can_publish);
        setChecklistResponse(response.data.checklist);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsLoading(false);
        let errorMessage = 'Failed to retrieve a checklist.';
        const rejectionError = rejection?.response?.data?.details;
        if (rejectionError) {
          errorMessage = `${errorMessage} ${rejectionError}`;
        }
        setErrorMessage(errorMessage);
      }
    }
  }, [show, organization.is_draft]);

  const checklist = useMemo(() => {
    return [
      {
        title: 'Nonprofit Page',
        href: `/private/manage-nonprofit/${organization.slug}/page/`,
        messages: checklistResponse?.page,
      },
      {
        title: 'Requested Goods',
        href: `/private/manage-nonprofit/${organization.slug}/requested-goods/`,
        messages: checklistResponse?.products,
      },
      {
        title: 'Delivery Instruction',
        href: `/private/manage-nonprofit/${organization.slug}/delivery-instruction/`,
        messages: checklistResponse?.instructions,
      },
      {
        title: 'Tax Information',
        href: `/private/manage-nonprofit/${organization.slug}/tax-information/`,
        messages: checklistResponse?.tax_information,
      },
    ].map((block) => {
      const hasError = block.messages?.some(
        ({ severity }) => severity === 'ERROR'
      );
      const hasWarning = block.messages?.some(
        ({ severity }) => severity === 'WARNING'
      );
      const isError = !isLoading && hasError;
      const isWarning = !isLoading && !hasError && hasWarning;
      const isSuccess = !isLoading && block?.messages?.length === 0;
      const isUndefined = !isLoading && !isError && !isWarning && !isSuccess;
      return {
        ...block,
        isLoading,
        isError,
        isWarning,
        isSuccess,
        isUndefined,
      };
    });
  }, [organization, isLoading, checklistResponse]);

  const canPublish = useMemo(() => {
    return !isLoading && !isPublishing && !isPublished && checklistCanPublish;
  }, [isLoading, isPublishing, isPublished, checklistCanPublish]);

  const handlePublish = useCallback(async () => {
    if (!canPublish) {
      return;
    }

    const cancelToken = getPublishCancelToken();
    setIsPublishing(true);

    try {
      const response = await publishAccountOrganization({
        organizationSlug: organization.slug,
        cancelToken,
      });

      setIsPublishing(false);
      setIsPublished(true);
      dispatch(patchOrganization(response.data));
    } catch (rejection) {
      if (isRequestCancel(rejection)) {
        return;
      }
      setIsPublishing(false);
      let errorMessage = 'Failed to publish.';
      const rejectionError = rejection?.response?.data?.details;
      if (rejectionError) {
        errorMessage = `${errorMessage} ${rejectionError}`;
      }
      setErrorMessage(errorMessage);
    }
  }, [canPublish]);

  const handleResetOnExit = useCallback(() => {
    setIsLoading(false);
    setIsPublishing(false);
    setIsPublished(false);
    setErrorMessage(null);
    setChecklistResponse(null);
    setChecklistCanPublish(false);
  }, []);

  const handleSupportTeamClick = useCallback(() => {
    dispatch(toggleLiveChat());
  }, []);

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={onHide}
      onExited={handleResetOnExit}
      aria-labelledby="publish-modal-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="publish-modal-title">
          {isPublished ? `Published for review 🎉` : 'Publish for review'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.body}>
        {isPublished ? (
          // PUBLISHED MESSAGE
          <Alert variant="success">
            <Alert.Heading>Congratulations!</Alert.Heading>

            <div className={styles.publishedAlertBody}>
              <div>
                Our team will now review your request and assess whether it
                meets our guidelines and requirements. We aim to provide a
                verdict within a reasonable timeframe and will communicate our
                decision via email (<b>{profile.email}</b>).
              </div>

              <div>
                We appreciate your patience while we work on this and hope to
                have your page published soon.
              </div>

              <div>
                If you have any further questions or concerns, please do not
                hesitate to reach out to our{' '}
                <span
                  role="button"
                  className={styles.supportTeamBtn}
                  onClick={handleSupportTeamClick}
                >
                  support team
                </span>
                .
              </div>
            </div>
          </Alert>
        ) : (
          // CHECKLIST
          <>
            <Alert variant="info">
              <div>
                Please make sure all the prerequisites are satisfied (see
                below).
              </div>
              <div>
                After you click &quot;Publish&quot;, the Shortage team will take
                a quick look and if everything is okay your page will be open to
                the public.
              </div>
            </Alert>

            {errorMessage ? (
              <Alert variant="danger">{errorMessage}</Alert>
            ) : null}

            <div className={styles.checklist}>
              <h5 className={styles.checklistTitle}>Checklist</h5>

              {checklist.map((block, index) => {
                return (
                  <div key={index} className={styles.checklistPoint}>
                    <div
                      className={classNames(styles.checklistPointTitle, {
                        [styles.success]: block.isSuccess,
                        [styles.warning]: block.isWarning,
                        [styles.error]: block.isError,
                      })}
                    >
                      {block.isLoading ? (
                        <Loader
                          className={animationStyles.rotate}
                          role="status"
                          aria-hidden="true"
                          size="1.25rem"
                        />
                      ) : null}

                      {block.isUndefined ? (
                        <Minus
                          role="status"
                          aria-hidden="true"
                          size="1.25rem"
                        />
                      ) : null}

                      {block.isSuccess ? (
                        <Check
                          role="status"
                          aria-hidden="true"
                          size="1.25rem"
                        />
                      ) : null}

                      {block.isWarning ? (
                        <AlertTriangle
                          role="status"
                          aria-hidden="true"
                          size="1.25rem"
                        />
                      ) : null}

                      {block.isError ? <XOctagon size="1.25rem" /> : null}

                      <Link
                        href={block.href}
                        className={styles.checklistLink}
                        onClick={() => onHide()}
                      >
                        {block.title}
                      </Link>

                      {block.isError ? (
                        <Badge bg="danger">blocker</Badge>
                      ) : null}
                      {block.isWarning ? (
                        <Badge bg="warning">recommended</Badge>
                      ) : null}
                    </div>

                    {block.messages?.length ? (
                      <ul className={styles.checklistDetails}>
                        {block.messages.map((message) => {
                          return (
                            <li
                              key={message.code}
                              className={classNames({
                                [styles.warning]:
                                  message.severity === 'WARNING',
                                [styles.error]: message.severity === 'ERROR',
                              })}
                            >
                              {message.message}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        {isPublished ? (
          <>
            <Button onClick={onHide} variant="outline-dark">
              Close
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handlePublish} disabled={!canPublish}>
              {isPublishing || isLoading ? (
                <Loader
                  role="status"
                  aria-hidden="true"
                  size="1.25rem"
                  className={animationStyles.rotate}
                />
              ) : (
                <Send size="1.25rem" />
              )}

              <span>Publish</span>
            </Button>

            <Button onClick={onHide} variant="outline-dark">
              Cancel
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
