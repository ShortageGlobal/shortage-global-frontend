import styles from './proceed-to-donation-button.module.scss';
import { useMemo, useCallback } from 'react';
import { ArrowRightCircle } from 'react-feather';
import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useCart } from 'core/hooks';
import * as gtm from 'core/tracking/gtm';

type ProceedToDonationButtonProps = {
  className?: string;
};

export function ProceedToDonationButton({
  className = '',
}: ProceedToDonationButtonProps) {
  const { cart, isDonationDetailsFilled, setIsCartSidebarShown } = useCart();

  const donationHref = useMemo(() => {
    return isDonationDetailsFilled
      ? { pathname: '/donation/details/cart' }
      : { pathname: '/donation/details' };
  }, [isDonationDetailsFilled]);

  const handleButtonClick = useCallback(() => {
    setIsCartSidebarShown(false);
    gtm.trackProceedToDonate({
      items: cart.items.map((item) => {
        return {
          productSlug: item.product.slug,
          productName: item.product.name,
          productPrice: item.product.price,
          quantity: item.quantity,
          organizationSlug: item.product.organization.slug,
        };
      }),
      totalPrice: cart.items.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
      }, 0),
    });
  }, [cart]);

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
