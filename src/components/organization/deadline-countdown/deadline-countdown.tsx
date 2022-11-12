import styles from './deadline-countdown.module.scss';
import { useState, useEffect, useMemo } from 'react';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { timeCountdown } from 'core/helpers';
import type { Organization } from 'core/api/types';
import { Calendar, CheckCircle } from 'react-feather';

type DeadlineCountdownProps = {
  deadline: Organization['deadline'];
};

const pluralize = (label, count) => `${label}${count === 1 ? '' : 's'}`;

export function DeadlineCountdown({ deadline }: DeadlineCountdownProps) {
  const [countdown, setCountdown] = useState(null);

  // update countdown every second
  useEffect(() => {
    setCountdown(timeCountdown({ date: deadline }));
    const interval = setInterval(() => {
      setCountdown(timeCountdown({ date: deadline }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const countdownMessage = useMemo(() => {
    if (!countdown) {
      return '';
    }

    // if deadline has passed
    if (Date.now() > Number(new Date(deadline))) {
      return (
        <>
          <CheckCircle size="1rem" aria-hidden />
          <span>Campaign ended</span>
        </>
      );
    }

    // show only one time unit
    let timeLeft;
    if (countdown.days > 0) {
      // show days left only
      timeLeft = `${countdown.days} ${pluralize('day', countdown.days)}`;
    } else if (countdown.hours > 0) {
      // show hours left only
      timeLeft = `${countdown.hours} ${pluralize('hour', countdown.hours)}`;
    } else if (countdown.minutes > 0) {
      // show minutes left only
      timeLeft = `${countdown.minutes} ${pluralize(
        'minute',
        countdown.minutes
      )}`;
    } else {
      // show seconds left only
      timeLeft = `${countdown.seconds} ${pluralize(
        'second',
        countdown.seconds
      )}`;
    }

    return (
      <>
        <Calendar size="1rem" aria-hidden />
        <span>{`Campaign ends in ${timeLeft}`}</span>
      </>
    );
  }, [countdown]);

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>{new Date(deadline).toLocaleString()}</Tooltip>}
    >
      <Badge className={styles.deadlineCountdown} bg="warning" text="dark">
        {countdownMessage}
      </Badge>
    </OverlayTrigger>
  );
}
