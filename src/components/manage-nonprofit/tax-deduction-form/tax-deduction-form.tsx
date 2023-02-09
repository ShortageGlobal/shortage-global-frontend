import commonStyles from 'styles/pages/private/common.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useEffect, useCallback, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import {
  useAppSelector,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import { updateAccountOrganization } from 'core/api';
import type { FormEvent } from 'react';

const INPUT_ID = Object.freeze({
  einNumber: 'einNumber',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.einNumber]: 'ein_number',
});
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];

export function TaxDeductionForm() {
  const { showNotification } = useNotifications();

  const { organization } = useAppSelector(selectAccountOrganization);

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [einNumber, setEinNumber] = useState('');

  // store organization in state
  useEffect(() => {
    setEinNumber(organization?.ein_number || '');
  }, [organization]);

  const getUpdateAccountOrganizationCancelToken = useCancelToken();

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isSaving) {
        return;
      }

      setIsSaving(true);

      const cancelToken = getUpdateAccountOrganizationCancelToken();

      try {
        await updateAccountOrganization({
          originalSlug: organization.slug,
          einNumber,
          cancelToken,
        });
        setErrors(null);
        setIsSaving(false);
        showNotification({
          isSuccess: true,
          message: 'Tax deduction details saved successfully',
        });
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        const rejectionErrors = rejection?.response?.data;
        if (rejectionErrors) {
          setErrors(rejectionErrors);
        }
        showNotification({
          isFailure: true,
          message:
            rejectionErrors?.details || 'Failed to save tax deduction details',
        });
      }

      setIsSaving(false);
    },
    [organization, isSaving, einNumber]
  );

  const getIsValid = (key: ErrorKey) =>
    !(errors?.[key]?.length > 0) && errors !== null;
  const getIsInvalid = (key: ErrorKey) => errors?.[key]?.length > 0;

  const getErrorsFeedback = (key: ErrorKey) =>
    errors?.[key]?.map((errorMessage) => {
      return (
        <Form.Control.Feedback key={errorMessage} type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      );
    });

  return (
    <Row>
      <Col>
        <Form className={commonStyles.form} onSubmit={handleFormSubmit}>
          {/* EIN number */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.einNumber}
              className={commonStyles.formGroup}
            >
              <Form.Label>EIN number</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                autoFocus
                required
                autoComplete="off"
                value={einNumber}
                onChange={(e) => setEinNumber(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.einNumber)}
                isInvalid={getIsInvalid(ERROR_KEYS.einNumber)}
              />
              {getErrorsFeedback(ERROR_KEYS.einNumber)}
            </Form.Group>
          </Row>

          {/* Submit Button */}
          <Row>
            <Col>
              <Button
                type="submit"
                size="lg"
                disabled={isSaving}
                className={commonStyles.submitBtn}
              >
                {isSaving ? (
                  <Loader
                    role="status"
                    aria-hidden="true"
                    className={animationStyles.rotate}
                  />
                ) : null}
                <span>Save</span>
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}
