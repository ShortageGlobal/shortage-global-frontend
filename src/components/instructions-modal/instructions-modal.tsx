import styles from './instructions-modal.module.scss';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { Check } from 'react-feather';
import Link from 'next/link';
import { Modal, Button, ButtonGroup } from 'react-bootstrap';
import { Organization, Campaign, Instruction } from 'core/api/types';

type InstructionsModalProps = {
  show: boolean;
  organizationSlug: Organization['slug'];
  organizationName: Organization['name'];
  campaignSlug?: Campaign['slug'];
  campaignUuid?: Campaign['uuid'];
  campaignName?: Campaign['name'];
  instructions: Instruction[];
  onHide: () => void;
};

export function InstructionsModal({
  show,
  organizationSlug,
  organizationName,
  campaignSlug,
  campaignUuid,
  campaignName,
  instructions,
  onHide,
}: InstructionsModalProps) {
  const [selectedInstruction] = useState(instructions?.[0]);
  const [isDropOff, setIsDropOff] = useState(true); // opposite to "Shipping"

  const boxLabel = useMemo(() => {
    let label = `IN THE BENEFIT OF ${organizationName} VIA SHORTAGE`;
    if (campaignName) {
      label = `${label} FOR THE "${campaignName}" CAMPAIGN`;
    }
    return `${label.toLocaleUpperCase()} + what's inside and quantity (use capital letters)`;
  }, [organizationName, campaignName]);

  const registerButtonHref = useMemo(() => {
    if (!campaignSlug || !campaignUuid) {
      return {
        pathname: '/[organizationSlug]/packages/',
        query: { organizationSlug, isDropOff },
      };
    }
    return {
      pathname:
        '/[organizationSlug]/campaigns/[campaignSlug]/[campaignUuid]/packages',
      query: { organizationSlug, campaignSlug, campaignUuid, isDropOff },
    };
  }, [organizationSlug, campaignSlug, campaignUuid, isDropOff]);

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
              {isDropOff ? <Check size={20} /> : null}
              <span>Drop Off</span>
            </Button>
            <span className={styles.separator}>OR</span>
            <Button
              variant="outline-dark"
              active={!isDropOff}
              onClick={() => setIsDropOff(false)}
            >
              {!isDropOff ? <Check size={20} /> : null}
              <span>Shipping</span>
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
                <blockquote>{boxLabel}</blockquote>
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
                <blockquote>{boxLabel}</blockquote>
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
        <Link href={registerButtonHref} passHref legacyBehavior>
          <Button size="lg" variant="primary" className={styles.confirmButton}>
            Register package for {organizationName}
            {campaignName ? ` (the "${campaignName}" campaign)` : null}
          </Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}
