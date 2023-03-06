import styles from './instructions-modal.module.scss';
import classNames from 'classnames';
import { useState } from 'react';
import Link from 'next/link';
import { Modal, Button } from 'react-bootstrap';
import { Organization, Instruction } from 'core/api/types';

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
        {selectedInstruction.address_line1 ? (
          <div className={styles.instructionDescription}>
            <ol>
              <li>Find the product and package it for shipping</li>
              <li>
                Write the following on the 2 sides of the package with a marker
                <blockquote>
                  IN THE BENEFIT OF {organizationName} (&ldquo;Shortage via{' '}
                  {organizationName}&rdquo;) + what&apos;s inside and quantity
                  (use capital letters)
                </blockquote>
              </li>
              <li>
                Ship the package directly from an online store or use short-term
                delivery via your favorite carrier to
                <blockquote>
                  <div>{selectedInstruction.name}:</div>
                  <div>{selectedInstruction.address_line1}</div>
                  {selectedInstruction.address_line2 ? (
                    <div>{selectedInstruction.address_line2}</div>
                  ) : null}
                  {[
                    selectedInstruction.city,
                    selectedInstruction.state_province_region,
                    selectedInstruction.zip,
                  ].join(', ')}
                  {selectedInstruction.phone_number ? (
                    <div>
                      Phone # {selectedInstruction.phone_number} (delivery
                      questions only)
                    </div>
                  ) : null}
                </blockquote>
                {selectedInstruction.comment ? (
                  <div>{selectedInstruction.comment}</div>
                ) : null}
              </li>
              <li>Register the package on our website to track its delivery</li>
            </ol>
          </div>
        ) : null}

        {!selectedInstruction.address_line1 &&
        selectedInstruction.description ? (
          <div
            className={styles.instructionDescription}
            dangerouslySetInnerHTML={{
              __html: selectedInstruction.description,
            }}
          />
        ) : null}
      </Modal.Body>

      <Modal.Footer>
        <Link
          href={{
            pathname: '/[organizationSlug]/packages/',
            query: { organizationSlug },
          }}
          passHref
          legacyBehavior
        >
          <Button size="lg" variant="primary" className={styles.confirmButton}>
            Register package for {organizationName}
          </Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}
