import styles from './instructions-modal.module.scss';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Modal, Button } from 'react-bootstrap';
import { Organization, Instruction } from 'app/api/types';

type InstructionsModalProps = {
  show: boolean;
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  instructions: Instruction[];
  onHide: () => void;
};

export function InstructionsModal({
  show,
  organizationSlug,
  organizationName,
  instructions,
  onHide,
}: InstructionsModalProps) {
  const [selectedInstruction] = useState(instructions?.[0]);

  const handleRegisterPackage = useCallback(() => {
    //
  }, []);

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
        <Link
          href={{
            pathname: '/organizations/[organizationSlug]/packages',
            query: { organizationSlug },
          }}
          passHref
        >
          <Button
            size="lg"
            variant="primary"
            className={styles.confirmButton}
            onClick={handleRegisterPackage}
          >
            Register package for {organizationName}
          </Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}
