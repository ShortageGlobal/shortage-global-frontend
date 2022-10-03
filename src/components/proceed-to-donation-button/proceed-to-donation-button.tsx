import styles from './proceed-to-donation-button.module.scss';
import { useMemo } from 'react';
import { ArrowRightCircle } from 'react-feather';
import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useCart } from 'app/hooks';

type ProceedToDonationButtonProps = {
  className?: string;
};

export function ProceedToDonationButton({
  className = '',
}: ProceedToDonationButtonProps) {
  const { isDonationDetailsFilled } = useCart();

  const donationHref = useMemo(() => {
    return isDonationDetailsFilled
      ? { pathname: '/donation/details/cart' }
      : { pathname: '/donation/details' };
  }, [isDonationDetailsFilled]);

  return (
    <Link href={donationHref} passHref>
      <Button
        size="lg"
        className={classNames(styles.proceedToDonationButton, className)}
      >
        <span>Proceed to donate</span>
        <ArrowRightCircle />
      </Button>
    </Link>
  );
}
