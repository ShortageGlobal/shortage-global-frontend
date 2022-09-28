import styles from './proceed-to-donation-button.module.scss';
import { ArrowRightCircle } from 'react-feather';
import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';

type ProceedToDonationButtonProps = {
  className?: string;
};

export function ProceedToDonationButton({
  className = '',
}: ProceedToDonationButtonProps) {
  return (
    <Link
      href={{
        pathname: '/donation/details',
      }}
      passHref
    >
      <Button
        size="lg"
        className={classNames(styles.proceedToDonationButton, className)}
      >
        <span>Proceed to donation</span>
        <ArrowRightCircle />
      </Button>
    </Link>
  );
}
