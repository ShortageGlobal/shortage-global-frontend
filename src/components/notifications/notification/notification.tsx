import styles from './notification.module.scss';
import { useMemo, useCallback, useState, useRef } from 'react';
import classNames from 'classnames';
import { Toast, CloseButton } from 'react-bootstrap';
import { NOTIFICATION_TYPE, NOTIFICATION_DELAY } from 'core/constants';
import type { Notification } from 'core/api/types';

type NotificationProps = {
  notification: Notification;
  onClose: (key: Notification['key']) => void;
};

export function Notification({ notification, onClose }: NotificationProps) {
  const [isPaused, setIsPaused] = useState(false);
  const countdownRef = useRef(null);

  const bg = useMemo(() => {
    if (notification.type === NOTIFICATION_TYPE.SUCCESS) {
      return 'success';
    }
    if (notification.type === NOTIFICATION_TYPE.FAILURE) {
      return 'danger';
    }
  }, [notification.type]);

  const handleClose = useCallback(() => {
    clearTimeout(countdownRef.current);
    return onClose(notification.key);
  }, [notification.key]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    clearTimeout(countdownRef.current);
    countdownRef.current = null;
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    const remainingTime = countdownRef.current
      ? countdownRef.current
      : NOTIFICATION_DELAY;
    countdownRef.current = setTimeout(handleClose, remainingTime);
  };

  return (
    <Toast
      bg={bg}
      autohide
      delay={NOTIFICATION_DELAY}
      onClose={handleClose}
      className={classNames(styles.notification)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="d-flex">
        <Toast.Body>{notification.message}</Toast.Body>
        <CloseButton
          variant="white"
          className={styles.closeButton}
          onClick={handleClose}
        />
      </div>
      <div
        className={styles.progressBar}
        style={{
          animationDuration: `${NOTIFICATION_DELAY}ms`,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      />
    </Toast>
  );
}
