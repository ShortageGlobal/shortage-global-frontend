

import styles from './online-stores-modal.module.scss';
import { Modal, Button } from 'react-bootstrap';
import Image from 'next/image';
import { OnlineStore } from 'core/api/types';

type OnlineStoresModalProps = {
  show: boolean;
  onlineStores: OnlineStore[];
  onHide: () => void;
};

export function OnlineStoresModal({
  show,
  onlineStores,
  onHide,
}: OnlineStoresModalProps) {
  const title =
    onlineStores.length === 1
      ? `Order from ${onlineStores[0].name}`
      : 'Order from the online store';
  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      dialogClassName={styles.onlineStoresModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className={styles.orderSteps}>
          <div>
            <div className={styles.stepImageWrap}>
              <Image
                alt=""
                src="/images/online-stores/order_cart.svg"
                layout="fill"
              />
            </div>
            <span>1. Order on the online store</span>
          </div>

          <div>
            <div className={styles.stepImageWrap}>
              <Image
                alt=""
                src="/images/online-stores/order_package.svg"
                layout="fill"
              />
            </div>
            <span>2. Register your package on Shortage</span>
          </div>

          <div>
            <div className={styles.stepImageWrap}>
              <Image
                alt=""
                src="/images/online-stores/order_update.svg"
                layout="fill"
              />
            </div>
            <span>3. Get delivery updates</span>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className={styles.footer}>
        {onlineStores.map((onlineStore) => {
          return (
            <Button
              key={onlineStore.name}
              size="lg"
              variant="primary"
              className={styles.onlineStoreLink}
              href={onlineStore.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Proceed to {onlineStore.name}
            </Button>
          );
        })}
      </Modal.Footer>
    </Modal>
  );
}
