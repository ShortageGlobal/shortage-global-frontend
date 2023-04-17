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
  const [isWasPaused, setIsWasPaused] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [timerId, setTimerId] = useState(null);

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
    if (countdown <= 0) {
      console.log(countdown);
      onClose(notification.key);
    }
    if (isWasPaused && !isAdded) {
      const additionTime = (countdown / 100) * 20;
      setIsAdded(true);
      setCountdown(countdown - additionTime);
    }
    if (!isPaused) {
      const id = setTimeout(() => {
        setCountdown(countdown - 1000);
      }, 1000);
      setTimerId(id);
    }
  }, [countdown, isPaused]);

  const pauseDelay = () => {
    clearTimeout(timerId);
    setIsWasPaused(true);
    setIsPaused(true);
  };

  const resumeDelay = () => {
    setIsPaused(false);
  };

  return (
    <>
      {notification ? (
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
              animationDuration: `${NOTIFICATION_DELAY}ms`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        </Toast>
      ) : null}
    </>
  );
}
