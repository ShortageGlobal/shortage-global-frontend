import commonStyles from 'styles/pages/private/common.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useEffect, useCallback, useState, useMemo } from 'react';
import { Row, Col, Alert, Form, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import {
  useAppDispatch,
  useAppSelector,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import {
  selectAccountDeliveryInstructions,
  addDeliveryInstruction,
  patchDeliveryInstruction,
} from 'core/store/slices/account-delivery-instruction';
import {
  createAccountDeliveryInstruction,
  updateAccountDeliveryInstruction,
} from 'core/api';
import { PhoneInput } from 'components/phone-input/phone-input';
import type { FormEvent } from 'react';

const INPUT_ID = Object.freeze({
  facilityName: 'facilityName',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  stateProvinceRegion: 'stateProvinceRegion',
  zip: 'zip',
  phoneNumber: 'phoneNumber',
  comment: 'comment',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.facilityName]: 'name',
  [INPUT_ID.addressLine1]: 'address_line1',
  [INPUT_ID.addressLine2]: 'address_line2',
  [INPUT_ID.city]: 'city',
  [INPUT_ID.stateProvinceRegion]: 'state_province_region',
  [INPUT_ID.zip]: 'zip',
  [INPUT_ID.phoneNumber]: 'phone_number',
  [INPUT_ID.comment]: 'comment',
});
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];

export function DeliveryInstructionForm() {
  const dispatch = useAppDispatch();
  const { showNotification } = useNotifications();

  const { organization } = useAppSelector(selectAccountOrganization);
  const { deliveryInstructions } = useAppSelector(
    selectAccountDeliveryInstructions
  );

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [facilityName, setFacilityName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateProvinceRegion, setStateProvinceRegion] = useState('');
  const [zip, setZip] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [comment, setComment] = useState('');

  const deliveryInstruction = useMemo(() => {
    return deliveryInstructions?.[0];
  }, [deliveryInstructions]);

  // store organization in state
  useEffect(() => {
    setFacilityName(deliveryInstruction?.name || '');
    setAddressLine1(deliveryInstruction?.address_line1 || '');
    setAddressLine2(deliveryInstruction?.address_line2 || '');
    setCity(deliveryInstruction?.city || '');
    setStateProvinceRegion(deliveryInstruction?.state_province_region || '');
    setZip(deliveryInstruction?.zip || '');
    setPhoneNumber(deliveryInstruction?.phone_number || '');
    setComment(deliveryInstruction?.comment || '');
  }, [deliveryInstruction]);

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
        let response;
        if (deliveryInstruction) {
          response = await updateAccountDeliveryInstruction({
            organizationSlug: organization.slug,
            id: deliveryInstruction.id,
            name: facilityName,
            addressLine1,
            addressLine2,
            city,
            stateProvinceRegion,
            zip,
            phoneNumber,
            comment,
            cancelToken,
          });
          dispatch(
            patchDeliveryInstruction({
              id: deliveryInstruction.id,
              patch: response.data,
            })
          );
        } else {
          response = await createAccountDeliveryInstruction({
            organizationSlug: organization.slug,
            name: facilityName,
            addressLine1,
            addressLine2,
            city,
            stateProvinceRegion,
            zip,
            phoneNumber,
            comment,
            cancelToken,
          });
          dispatch(addDeliveryInstruction(response.data));
        }
        setErrors(null);
        setIsSaving(false);
        showNotification({
          isSuccess: true,
          message: 'Delivery instruction details saved successfully',
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
            rejectionErrors?.details ||
            'Failed to save delivery instruction details',
        });
      }

      setIsSaving(false);
    },
    [
      organization,
      deliveryInstruction,
      isSaving,
      facilityName,
      addressLine1,
      addressLine2,
      city,
      stateProvinceRegion,
      zip,
      phoneNumber,
      comment,
    ]
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
          <Row>
            <Col>
              <Alert variant="info" className="mb-4">
                The address of the office/warehouse where you are ready to
                accept in-kind donations.
              </Alert>
            </Col>
          </Row>

          {/* Name */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.facilityName}
              className={commonStyles.formGroup}
            >
              <Form.Label>Name</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                autoFocus
                required
                autoComplete="off"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.facilityName)}
                isInvalid={getIsInvalid(ERROR_KEYS.facilityName)}
                readOnly={!organization.is_draft}
              />
              <Form.Text as="div">The name of the facility.</Form.Text>
              {getErrorsFeedback(ERROR_KEYS.facilityName)}
            </Form.Group>
          </Row>

          <Row>
            <Form.Group
              as={Col}
              xs={6}
              controlId={INPUT_ID.addressLine1}
              className={commonStyles.formGroup}
            >
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder=""
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.addressLine1)}
                isInvalid={getIsInvalid(ERROR_KEYS.addressLine1)}
              />
              {getErrorsFeedback(ERROR_KEYS.addressLine1)}
            </Form.Group>

            <Form.Group
              as={Col}
              xs={6}
              controlId={INPUT_ID.addressLine2}
              className={commonStyles.formGroup}
            >
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder=""
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.addressLine2)}
                isInvalid={getIsInvalid(ERROR_KEYS.addressLine2)}
              />
              {getErrorsFeedback(ERROR_KEYS.addressLine2)}
            </Form.Group>

            <Form.Group
              as={Col}
              xs={6}
              controlId={INPUT_ID.city}
              className={commonStyles.formGroup}
            >
              <Form.Label>City</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder=""
                value={city}
                onChange={(e) => setCity(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.city)}
                isInvalid={getIsInvalid(ERROR_KEYS.city)}
              />
              {getErrorsFeedback(ERROR_KEYS.city)}
            </Form.Group>

            <Form.Group
              as={Col}
              xs={6}
              controlId={INPUT_ID.stateProvinceRegion}
              className={commonStyles.formGroup}
            >
              <Form.Label>State / Province</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder=""
                value={stateProvinceRegion}
                onChange={(e) => setStateProvinceRegion(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.stateProvinceRegion)}
                isInvalid={getIsInvalid(ERROR_KEYS.stateProvinceRegion)}
              />
              {getErrorsFeedback(ERROR_KEYS.stateProvinceRegion)}
            </Form.Group>

            <Form.Group
              as={Col}
              xs={6}
              controlId={INPUT_ID.zip}
              className={commonStyles.formGroup}
            >
              <Form.Label>Zip</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder=""
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.zip)}
                isInvalid={getIsInvalid(ERROR_KEYS.zip)}
              />
              {getErrorsFeedback(ERROR_KEYS.zip)}
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
                inputProps={{ id: 'phoneNumber' }}
                inputClass="form-control-lg"
                isValid={getIsValid(ERROR_KEYS.phoneNumber)}
                isInvalid={getIsInvalid(ERROR_KEYS.phoneNumber)}
                onChange={(phone) => setPhoneNumber(phone)}
              />
              <Form.Text as="div">
                Phone number for questions on deliveries only. Optional.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.phoneNumber)}
            </Form.Group>

            <Form.Group
              as={Col}
              controlId={INPUT_ID.comment}
              className={commonStyles.formGroup}
            >
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                size="lg"
                type="text"
                placeholder=""
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.comment)}
                isInvalid={getIsInvalid(ERROR_KEYS.comment)}
              />
              <Form.Text as="div">
                Additional comment to the delivery instructions. Optional.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.comment)}
            </Form.Group>
          </Row>

          {/* Submit Button */}
          {organization.is_draft ? (
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
          ) : null}
        </Form>
      </Col>
    </Row>
  );
}
