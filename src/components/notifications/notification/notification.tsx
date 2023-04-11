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
  const [isHovered, setIsHovered] = useState(false);
  const countdownRef = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [countdown, setCountdown] = useState(NOTIFICATION_DELAY); // 5000 ms

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
    setIsHovered(true);
    console.log(countdown); // 5000 ?!
    clearTimeout(countdownRef.current);
    countdownRef.current = null;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const remainingTime = countdownRef.current
      ? countdownRef.current
      : countdown;
    countdownRef.current = setTimeout(handleClose, remainingTime);
  };

  return (
    <Toast
      bg={bg}
      autohide
      delay={countdown}
      onClose={handleClose}
      className={classNames(styles.notification)}
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
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
        className={styles['loading-bar']}
        style={{
          animationDuration: `${countdown / 1000}s`,
          animationPlayState: isHovered ? 'paused' : 'running',
        }}
      />
    </Toast>
  );
}
