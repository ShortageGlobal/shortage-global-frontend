import styles from './proceed-to-donation-button.module.scss';
import { ArrowRightCircle } from 'react-feather';
import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { Organization } from 'app/api/types';

type ProceedToDonationButtonProps = {
  organizationSlug: Organization['slug'];
  className?: string;
};

export function ProceedToDonationButton({
  organizationSlug,
  className = '',
}: ProceedToDonationButtonProps) {
  return (
    <Link
      href={{
        pathname: '/organizations/[organizationSlug]/packages',
        query: { organizationSlug },
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
