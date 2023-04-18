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
  const [timeDifference, setTimeDifference] = useState(0);
  const timerIdRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();
  const endTimeRef = useRef<number>();

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
    startTimeRef.current = currentTime;
    timerIdRef.current = setTimeout(() => {
      setCountdown(0);
    }, NOTIFICATION_DELAY);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      onClose(notification.key);
    }

    if (!isPaused && endTimeRef.current) {
      startTimeRef.current = Date.now();
      timerIdRef.current = setTimeout(() => {
        setCountdown(0);
      }, NOTIFICATION_DELAY - timeDifference);
    }
  }, [countdown, isPaused]);

  const pauseDelay = () => {
    clearTimeout(timerIdRef.current);
    endTimeRef.current = Date.now();
    setTimeDifference(
      (prev) => prev + Math.abs(endTimeRef.current - startTimeRef.current)
    );
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
