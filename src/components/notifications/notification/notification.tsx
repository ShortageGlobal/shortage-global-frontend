import styles from './notification.module.scss';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { Toast, CloseButton } from 'react-bootstrap';
import { NOTIFICATION_TYPE, NOTIFICATION_DELAY } from 'core/constants';
import type { Notification } from 'core/api/types';

type NotificationProps = {
  notification: Notification;
  onClose: (key: Notification['key']) => void;
};

export function Notification({ notification, onClose }: NotificationProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(NOTIFICATION_DELAY);
  const showStartDate = useRef(Date.now());

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

  const handlePause = useCallback(() => {
    setIsPaused(true);
    const timeSinceStart = Date.now() - showStartDate.current;
    setTimeLeft(timeLeft - timeSinceStart);
  }, [timeLeft]);

  const handleResume = useCallback(() => {
    setIsPaused(false);
    showStartDate.current = Date.now();
  }, []);

  // close notification by timeout
  useEffect(() => {
    if (isPaused) {
      return;
    }
    const timerId = setTimeout(() => {
      handleClose();
    }, timeLeft);

    return () => {
      clearTimeout(timerId);
    };
  }, [isPaused, timeLeft, handleClose]);

  return (
    <Toast
      bg={bg}
      className={styles.notification}
      onClose={handleClose}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
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
