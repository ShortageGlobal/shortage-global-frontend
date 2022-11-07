import styles from './notifications.module.scss';
import { useCallback } from 'react';
import { ToastContainer } from 'react-bootstrap';
import { useNotifications } from 'core/hooks';
import { Notification } from 'components/notifications/notification/notification';

export function Notifications() {
  const { notifications, hideNotification } = useNotifications();

  const handleNotificationClose = useCallback(
    (key) => {
      hideNotification(key);
    },
    [hideNotification]
  );

  return (
    <ToastContainer
      position="top-end"
      containerPosition="fixed"
      className={styles.notifications}
    >
      {notifications.map((notification) => {
        return (
          <Notification
            key={notification.key}
            notification={notification}
            onClose={handleNotificationClose}
          />
        );
      })}
    </ToastContainer>
  );
}
