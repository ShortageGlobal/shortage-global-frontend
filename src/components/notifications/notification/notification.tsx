import styles from './notification.module.scss';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
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
  const timerIdRef = useRef<NodeJS.Timeout>();
  const mountTimeRef = useRef<number>();
  const pausedTimeRef = useRef<number>();

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
    const currentTime = Date.now();
    mountTimeRef.current = currentTime;
    timerIdRef.current = setTimeout(() => {
      setCountdown(countdown - NOTIFICATION_DELAY);
    }, NOTIFICATION_DELAY);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      onClose(notification.key);
    }

    if (!isPaused && isWasPaused && pausedTimeRef.current) {
      const timeDifference = pausedTimeRef.current - mountTimeRef.current;
      console.log(NOTIFICATION_DELAY - timeDifference);
      timerIdRef.current = setTimeout(() => {
        setCountdown(NOTIFICATION_DELAY - timeDifference);
      }, NOTIFICATION_DELAY - timeDifference);
    }
  }, [countdown, isPaused]);

  const pauseDelay = () => {
    clearTimeout(timerIdRef.current);
    pausedTimeRef.current = Date.now();
    setIsWasPaused(true);
    setIsPaused(true);
  };

  const resumeDelay = () => {
    setIsPaused(false);
  };

  return (
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
  );
}
