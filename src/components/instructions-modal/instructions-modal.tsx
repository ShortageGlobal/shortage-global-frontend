import styles from './instructions-modal.module.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Instruction } from 'app/api/types';

type InstructionsModalProps = {
  show: boolean;
  instructions: Instruction[];
  onHide: () => void;
  onConfirm: () => void;
};

export function InstructionsModal({
  show,
  instructions,
  onHide,
  onConfirm,
}: InstructionsModalProps) {
  const [selectedInstruction, setSelectedInstruction] = useState(
    instructions?.[0]
  );

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      dialogClassName={classNames(
        styles.instructionsModal,
        'modal-dialog-scrollable'
      )}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delivery instructions</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div
          className={styles.instructionDescription}
          dangerouslySetInnerHTML={{ __html: selectedInstruction.description }}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button
          size="lg"
          variant="primary"
          className={styles.confirmButton}
          onClick={onConfirm}
        >
          Add items to my package
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
