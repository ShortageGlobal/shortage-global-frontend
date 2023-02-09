import styles from './notification.module.scss';
import { useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { Toast, CloseButton } from 'react-bootstrap';
import { NOTIFICATION_TYPE } from 'core/constants';
import type { Notification } from 'core/api/types';

type NotificationProps = {
  notification: Notification;
  onClose: (key: Notification['key']) => void;
};

export function Notification({ notification, onClose }: NotificationProps) {
  const bg = useMemo(() => {
    if (notification.type === NOTIFICATION_TYPE.SUCCESS) {
      return 'success';
    }
    if (notification.type === NOTIFICATION_TYPE.FAILURE) {
      return 'danger';
    }
  }, [notification.type]);

  const handleClose = useCallback(() => {
    return onClose(notification.key);
  }, [notification.key]);

  return (
    <Toast
      bg={bg}
      autohide
      delay={3000}
      onClose={handleClose}
      className={classNames(styles.notification)}
    >
      <div className="d-flex">
        <Toast.Body>{notification.message}</Toast.Body>
        <CloseButton
          variant="white"
          className={styles.closeButton}
          onClick={handleClose}
        />
      </div>
    </Toast>
  );
}
