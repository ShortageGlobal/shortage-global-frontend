import styles from './notification.module.scss';
import { useMemo, useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Toast, CloseButton } from 'react-bootstrap';
import { NOTIFICATION_TYPE, NOTIFICATION_DELAY } from 'core/constants';
import type { Notification } from 'core/api/types';

type NotificationProps = {
  notification: Notification;
  onClose: (key: Notification['key']) => void;
};

export function Notification({ notification, onClose }: NotificationProps) {
  const [countdown, setCountdown] = useState(NOTIFICATION_DELAY);
  const [isPaused, setIsPaused] = useState(false);

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

  useEffect(() => {
    if (countdown < 0) return;
    if (!isPaused) {
      setTimeout(() => {
        setCountdown(countdown - 100);
      }, 100);
    }
  }, [countdown, isPaused]);

  const pauseDelay = () => {
    setIsPaused(true);
  };

  const resumeDelay = () => {
    setIsPaused(false);
  };

  return (
    <>
      {countdown > 0 && (
        <Toast
          bg={bg}
          onClose={handleClose}
          className={classNames(styles.notification)}
          onMouseEnter={pauseDelay}
          onMouseLeave={resumeDelay}
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
              animationDuration: `${NOTIFICATION_DELAY + 200}ms`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        </Toast>
      )}
    </>
  );
}
