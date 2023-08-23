import commonStyles from 'styles/pages/private/common.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useEffect, useCallback, useState, useMemo } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import {
  useUser,
  useNotifications,
  useCancelToken,
  isRequestCancel,
  useNavigationLock,
} from 'core/hooks';
import { updateProfile } from 'core/api';
import { bothEmptyOrEqual } from 'core/helpers';
import { LoadingMessage } from 'components/loading-message/loading-message';
import { PhoneInput } from 'components/phone-input/phone-input';
import type { FormEvent } from 'react';

const INPUT_ID = Object.freeze({
  firstName: 'firstName',
  lastName: 'lastName',
  phoneNumber: 'phoneNumber',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.firstName]: 'first_name',
  [INPUT_ID.lastName]: 'last_name',
  [INPUT_ID.phoneNumber]: 'phone_number',
});
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];

export function ProfileForm() {
  const { showNotification } = useNotifications();
  const { profile, isProfileReady, storeProfile } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const getUpdateProfileCancelToken = useCancelToken();

  // store profile in state
  useEffect(() => {
    setFirstName(profile?.firstName || '');
    setLastName(profile?.lastName || '');
    setPhoneNumber(profile?.phoneNumber || '');
  }, [profile]);

  const isFormDirty = useMemo(() => {
    if (!profile) {
      return false;
    }

    if (
      bothEmptyOrEqual(profile.firstName, firstName) &&
      bothEmptyOrEqual(profile.lastName, lastName) &&
      bothEmptyOrEqual(profile.phoneNumber, phoneNumber)
    ) {
      return false;
    }

    return true;
  }, [profile, firstName, lastName, phoneNumber]);

  useNavigationLock(isFormDirty);

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSaving(true);

      const cancelToken = getUpdateProfileCancelToken();

      try {
        const response = await updateProfile({
          firstName,
          lastName,
          phoneNumber,
          cancelToken,
        });
        storeProfile(response.data);
        setErrors(null);
        setIsSaving(false);
        showNotification({
          isSuccess: true,
          message: 'Profile saved successfully',
        });
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsSaving(false);
        const rejectionErrors = rejection?.response?.data;
        if (rejectionErrors) {
          setErrors(rejection?.response?.data);
        } else {
          setErrors(null);
          showNotification({
            isFailure: true,
            message: 'Failed to update profile',
          });
        }
      }
    },
    [firstName, lastName, phoneNumber, showNotification]
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
    <>
      {!isProfileReady ? (
        <Row>
          <Col>
            <LoadingMessage />
          </Col>
        </Row>
      ) : null}

      {isProfileReady ? (
        <Row>
          <Col>
            <Form className={commonStyles.form} onSubmit={handleFormSubmit}>
              <Row>
                <Form.Group
                  as={Col}
                  xs={6}
                  controlId={INPUT_ID.firstName}
                  className={commonStyles.formGroup}
                >
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    size="lg"
                    type="text"
                    autoFocus
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    isValid={getIsValid(ERROR_KEYS.firstName)}
                    isInvalid={getIsInvalid(ERROR_KEYS.firstName)}
                  />
                  {getErrorsFeedback(ERROR_KEYS.firstName)}
                </Form.Group>

                <Form.Group
                  as={Col}
                  xs={6}
                  controlId={INPUT_ID.lastName}
                  className={commonStyles.formGroup}
                >
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder=""
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    isValid={getIsValid(ERROR_KEYS.lastName)}
                    isInvalid={getIsInvalid(ERROR_KEYS.lastName)}
                  />
                  {getErrorsFeedback(ERROR_KEYS.lastName)}
                </Form.Group>

                <Form.Group
                  as={Col}
                  xs={6}
                  controlId={'email'}
                  className={commonStyles.formGroup}
                >
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    size="lg"
                    type="email"
                    placeholder=""
                    readOnly
                    value={profile?.email || ''}
                  />
                </Form.Group>

                <Form.Group
                  as={Col}
                  xs={6}
                  controlId={INPUT_ID.phoneNumber}
                  className={commonStyles.formGroup}
                >
                  <Form.Label>Phone Number</Form.Label>
                  <PhoneInput
                    value={phoneNumber}
                    inputProps={{ id: INPUT_ID.phoneNumber }}
                    inputClass="form-control-lg"
                    isValid={getIsValid(ERROR_KEYS.phoneNumber)}
                    isInvalid={getIsInvalid(ERROR_KEYS.phoneNumber)}
                    onChange={(phone) => setPhoneNumber(phone)}
                  />
                  {getErrorsFeedback(ERROR_KEYS.phoneNumber)}
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
                    <span>Save profile</span>
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      ) : null}
    </>
  );
}
