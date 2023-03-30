import styles from './instructions-modal.module.scss';
import classNames from 'classnames';
import { useState } from 'react';
import Link from 'next/link';
import { Modal, Button, ButtonGroup } from 'react-bootstrap';
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
  const [isDropOff, setIsDropOff] = useState(true); // opposite to "Shipping"

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
        <div className="d-flex justify-content-center">
          <ButtonGroup size="lg" className="mb-4">
            <Button
              variant="outline-dark"
              active={isDropOff}
              onClick={() => setIsDropOff(true)}
            >
              Drop Off
            </Button>
            <Button
              variant="outline-dark"
              active={!isDropOff}
              onClick={() => setIsDropOff(false)}
            >
              Shipping
            </Button>
          </ButtonGroup>
        </div>
        <div className={styles.instructionDescription}>
          {isDropOff ? (
            <ol>
              <li>Prepare the product for drop off</li>
              <li>
                Use a marker to label the box/product with the following
                information:
                <blockquote>
                  IN THE BENEFIT OF {organizationName} VIA SHORTAGE +
                  what&apos;s inside and quantity (use capital letters)
                </blockquote>
              </li>
              <li>
                Drop off the package directly to
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
              <li>
                Register the package on our website to receive a tax deduction
                receipt and an impact report
              </li>
            </ol>
          ) : (
            <ol>
              <li>Find the product and package it for shipping</li>
              <li>
                Write the following on the 2 sides of the package with a marker:
                <blockquote>
                  IN THE BENEFIT OF {organizationName} VIA SHORTAGE +
                  what&apos;s inside and quantity (use capital letters)
                </blockquote>
              </li>
              <li>
                Ship the package directly from an online store or order delivery
                via your favorite carrier to
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
              <li>
                Register the package on our website to track its delivery,
                receive a tax deduction receipt and an impact report
              </li>
            </ol>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Link
          href={{
            pathname: '/[organizationSlug]/packages/',
            query: { organizationSlug, isDropOff },
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
