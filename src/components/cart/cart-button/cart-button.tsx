import styles from './cart-button.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useCallback } from 'react';
import classNames from 'classnames';
import { Button, Badge } from 'react-bootstrap';
import { ShoppingCart } from 'react-feather';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { selectCart, setIsCartSidebarShown } from 'core/store/slices/cart';

type CartButtonProps = {
  className?: string;
};

export function CartButton({ className }: CartButtonProps) {
  const dispatch = useAppDispatch();

  const { cart } = useAppSelector(selectCart);

  const handleCartSidebarShow = useCallback(() => {
    dispatch(setIsCartSidebarShown(true));
  }, []);

  return (
    <Button
      variant=""
      className={classNames(styles.cartButton, className)}
      onClick={handleCartSidebarShow}
    >
      <ShoppingCart size={20} />

      <span className="visually-hidden">Donation cart</span>

      {/* Count of Products in the cart  */}
      {cart?.items?.length > 0 ? (
        <Badge
          pill
          className={classNames(styles.cartButtonBadge, animationStyles.scale)}
        >
          {cart.items.length}
          <span className="visually-hidden"> products in cart</span>
        </Badge>
      ) : null}
    </Button>
  );
}
