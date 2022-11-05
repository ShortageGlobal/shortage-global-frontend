import styles from './loading-message.module.scss';
import animationStyles from 'styles/animations.module.scss';
import classNames from 'classnames';
import { Loader } from 'react-feather';
import type { ReactNode } from 'react';

type LoadingMessageProps = {
  children?: ReactNode;
  className?: string;
};

export function LoadingMessage({
  children = null,
  className = '',
}: LoadingMessageProps) {
  return (
    <p className={classNames(styles.loadingMessage, className)}>
      <Loader
        role="status"
        aria-hidden="true"
        className={animationStyles.rotate}
      />
      {children ? children : <span>Loading...</span>}
    </p>
  );
}
