/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const [isPaused, setIsPaused] = useState(false);
  const [isShow, setIsShow] = useState(true);
  const [countdown, setCountdown] = useState(NOTIFICATION_DELAY);
  const [remainingTime, setRemainingTime] = useState(null);
  console.log(
    `initial delay: countdown - ${countdown}, remaining time - ${remainingTime}`
  );

  const bg = useMemo(() => {
    if (notification.type === NOTIFICATION_TYPE.SUCCESS) {
      return 'success';
    }
    if (notification.type === NOTIFICATION_TYPE.FAILURE) {
      return 'danger';
    }
  }, [notification.type]);

  const handleClose = useCallback(() => {
    clearInterval(countdown);
    return onClose(notification.key);
  }, [notification.key]);

  useEffect(() => {
    console.log(countdown);
    setInterval(() => {
      setCountdown(countdown - 1);
      if (countdown <= 0) setIsShow(false);
    }, countdown);
  }, []);

  const pauseDelay = () => {
    //   console.log(
    //     `pause delay: countdown - ${countdown}, remaining time - ${remainingTime}`
    //   );
    //   setIsPaused(true);
    //   clearInterval(countdown);
    //   setRemainingTime(countdown);
  };

  const resumeDelay = () => {
    console.log(countdown);

    // console.log(
    //   `resume delay: countdown - ${countdown}, remaining time - ${remainingTime}`
    // );
    // setIsPaused(false);
    // setCountdown(remainingTime);
    // setInterval(() => {
    //   setCountdown((prev) => prev - 1000);
    //   if (countdown <= 0) setIsShow(false);
    // }, remainingTime);
  };

  return (
    <Toast
      bg={bg}
      onClose={handleClose}
      className={classNames(styles.notification)}
      onMouseEnter={pauseDelay}
      onMouseLeave={resumeDelay}
      show={isShow}
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
