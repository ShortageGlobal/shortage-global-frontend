import styles from './share-button.module.scss';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Share2 } from 'react-feather';
import classNames from 'classnames';
import { ShareModal } from './modal/share-modal';
import type { ButtonProps } from 'react-bootstrap';

type ShareButtonProps = {
  url: string;
  text?: string;
  className?: string;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  disabled?: boolean;
};

export function ShareButton({
  url,
  text = '',
  className = '',
  size = 'lg',
  variant = 'outline-dark',
  disabled = false,
}: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        size={size}
        variant={variant}
        className={classNames(styles.shareButton, className)}
        onClick={() => setShowModal(true)}
        disabled={disabled}
      >
        <Share2 aria-hidden="true" />
        <span className={styles.buttonLabel}>Share</span>
      </Button>

      <ShareModal
        url={url}
        text={text}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </>
  );
}
