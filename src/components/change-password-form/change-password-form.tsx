import commonStyles from 'styles/pages/private/common.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useCallback, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import { updateProfilePassword } from 'core/api';
import type { FormEvent } from 'react';

const INPUT_ID = Object.freeze({
  oldPassword: 'oldPassword',
  newPassword: 'newPassword',
  confirmPassword: 'confirmPassword',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.oldPassword]: 'old_password',
  [INPUT_ID.newPassword]: 'new_password',
  [INPUT_ID.confirmPassword]: 'confirm_password',
});
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];

export function ChangePasswordForm() {
  const { showNotification } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const getUpdateProfilePasswordCancelToken = useCancelToken();

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isSaving) {
        return;
      }

      setIsSaving(true);

      const cancelToken = getUpdateProfilePasswordCancelToken();

      const target = e.target as HTMLFormElement & {
        oldPassword: HTMLInputElement;
        newPassword: HTMLInputElement;
        confirmPassword: HTMLInputElement;
      };

      try {
        await updateProfilePassword({
          oldPassword: target.oldPassword.value,
          newPassword: target.newPassword.value,
          confirmPassword: target.confirmPassword.value,
          cancelToken,
        });
        setErrors(null);
        setIsSaving(false);
        showNotification({
          isSuccess: true,
          message: 'Password changed successfully',
        });
        target.reset();
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsSaving(false);
        const rejectionErrors = rejection?.response?.data;
        if (rejectionErrors) {
          setErrors(rejectionErrors);
        } else {
          setErrors(null);
          showNotification({
            isFailure: true,
            message: 'Failed to change password',
          });
        }
      }
    },
    [isSaving, showNotification]
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
    <Form
      className={commonStyles.form}
      autoComplete="off"
      onSubmit={handleFormSubmit}
    >
      <Row>
        <Form.Group
          as={Col}
          sm={6}
          controlId={INPUT_ID.oldPassword}
          className={commonStyles.formGroup}
        >
          <Form.Label>Old Password</Form.Label>
          <Form.Control
            autoFocus
            size="lg"
            type="password"
            placeholder=""
            required
            isValid={getIsValid(ERROR_KEYS.oldPassword)}
            isInvalid={getIsInvalid(ERROR_KEYS.oldPassword)}
          />
          {getErrorsFeedback(ERROR_KEYS.oldPassword)}
        </Form.Group>
      </Row>

      <Row>
        <Form.Group
          as={Col}
          sm={6}
          controlId={INPUT_ID.newPassword}
          className={commonStyles.formGroup}
        >
          <Form.Label>New Password</Form.Label>
          <Form.Control
            size="lg"
            type="password"
            placeholder=""
            required
            isValid={getIsValid(ERROR_KEYS.newPassword)}
            isInvalid={getIsInvalid(ERROR_KEYS.newPassword)}
          />
          {getErrorsFeedback(ERROR_KEYS.newPassword)}
        </Form.Group>

        <Form.Group
          as={Col}
          sm={6}
          controlId={INPUT_ID.confirmPassword}
          className={commonStyles.formGroup}
        >
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            size="lg"
            type="password"
            placeholder=""
            required
            isValid={getIsValid(ERROR_KEYS.confirmPassword)}
            isInvalid={getIsInvalid(ERROR_KEYS.confirmPassword)}
          />
          {getErrorsFeedback(ERROR_KEYS.confirmPassword)}
        </Form.Group>
      </Row>

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
  );
}
