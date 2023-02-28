import styles from './share-modal.module.scss';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Button,
  Form,
  Alert,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import classNames from 'classnames';
import { Check, Copy } from 'react-feather';
import { Email, Facebook, LinkedIn, Reddit, Twitter } from 'components/icons';

type ShareModalProps = {
  url: string;
  text?: string;
  show: boolean;
  onHide: () => void;
};

export function ShareModal({ url, text, show, onHide }: ShareModalProps) {
  const clearCopySuccessTooltipTimeout =
    useRef<ReturnType<typeof setTimeout>>();
  const [showCopySuccessTooltip, setShowCopySuccessTooltip] = useState(false);

  const urlEncoded = encodeURIComponent(url);
  const textEncoded = text ? encodeURIComponent(text) : '';

  // hide tooltip on modal close
  useEffect(() => {
    if (!show) {
      setShowCopySuccessTooltip(false);
      clearTimeout(clearCopySuccessTooltipTimeout.current);
    }
  }, [show]);

  const handleLinkCopy = useCallback(() => {
    navigator.clipboard.writeText(url);
    clearTimeout(clearCopySuccessTooltipTimeout.current);
    clearCopySuccessTooltipTimeout.current = setTimeout(() => {
      setShowCopySuccessTooltip(false);
    }, 2000);
    setShowCopySuccessTooltip(true);
  }, [url]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName={classNames(styles.shareModal, 'modal-dialog-scrollable')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Help by sharing</Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.shareModalBody}>
        <Alert variant="info">
          <span>Sharing on social media can be as helpful as donating.</span>
        </Alert>

        <div className={styles.socialLinks}>
          {/* Facebook */}
          <a
            className={styles.link}
            href={`https://facebook.com/sharer/sharer.php?u=${urlEncoded}`}
            target="_blank"
            rel="noreferrer"
          >
            <Facebook size={30} />
            <span>Facebook</span>
          </a>

          {/* Twitter */}
          <a
            className={styles.link}
            href={`https://twitter.com/intent/tweet/?text=${textEncoded}&url=${urlEncoded}`}
            target="_blank"
            rel="noreferrer"
          >
            <Twitter size={30} />
            <span>Twitter</span>
          </a>

          {/* LinkedIn */}
          <a
            className={styles.link}
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${urlEncoded}&title=${textEncoded}&summary=${textEncoded}&source=${urlEncoded}`}
            target="_blank"
            rel="noreferrer"
          >
            <LinkedIn size={30} />
            <span>LinkedIn</span>
          </a>

          {/* Reddit */}
          <a
            className={styles.link}
            href={`https://reddit.com/submit/?url=${urlEncoded}&resubmit=true&title=${textEncoded}`}
            target="_blank"
            rel="noreferrer"
          >
            <Reddit size={30} />
            <span>Reddit</span>
          </a>

          {/* Email */}
          <a
            className={styles.link}
            href={`mailto:?subject=${textEncoded}&body=${urlEncoded}`}
            target="_self"
            rel="noreferrer"
          >
            <Email size={30} />

            <span>Email</span>
          </a>
        </div>

        <div>
          <Form.Label>Copy link</Form.Label>
          <OverlayTrigger
            show={showCopySuccessTooltip}
            placement="top"
            overlay={
              <Tooltip>
                <span className="d-flex align-items-center">
                  <Check size="1rem" />
                  <span className="ms-1">Copied!</span>
                </span>
              </Tooltip>
            }
          >
            <div className={styles.copyLinkGroup}>
              <Form.Control value={url} readOnly onClick={handleLinkCopy} />

              <Button
                variant="outline-dark"
                className={styles.copyBtn}
                onClick={handleLinkCopy}
              >
                <Copy size="1rem" />
                <span>Copy</span>
              </Button>
            </div>
          </OverlayTrigger>
        </div>
      </Modal.Body>
    </Modal>
  );
}
