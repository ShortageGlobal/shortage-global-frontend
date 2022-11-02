import styles from './proceed-to-donation-button.module.scss';
import { useMemo, useCallback } from 'react';
import { ArrowRightCircle } from 'react-feather';
import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useCart } from 'core/hooks';
import * as fbq from 'core/tracking/fpixel';

type ProceedToDonationButtonProps = {
  className?: string;
};

export function ProceedToDonationButton({
  className = '',
}: ProceedToDonationButtonProps) {
  const { isDonationDetailsFilled, setIsCartSidebarShown } = useCart();

  const donationHref = useMemo(() => {
    return isDonationDetailsFilled
      ? { pathname: '/donation/details/cart' }
      : { pathname: '/donation/details' };
  }, [isDonationDetailsFilled]);

  const handleButtonClick = useCallback(() => {
    setIsCartSidebarShown(false);
    fbq.event('InitiateCheckout');
  }, []);

  return (
    <Link href={donationHref} passHref legacyBehavior>
      <Button
        size="lg"
        className={classNames(styles.proceedToDonationButton, className)}
        onClick={handleButtonClick}
      >
        <span>Proceed to donate</span>
        <ArrowRightCircle />
      </Button>
    </Link>
  );
}
