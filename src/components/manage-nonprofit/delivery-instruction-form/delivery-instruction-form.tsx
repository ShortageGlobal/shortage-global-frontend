import commonStyles from 'styles/pages/private/common.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useEffect, useCallback, useState, useMemo } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
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
import { HtmlEditor } from 'components/html-editor/html-editor';
import type { FormEvent } from 'react';

const INPUT_ID = Object.freeze({
  name: 'name',
  description: 'description',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.name]: 'name',
  [INPUT_ID.description]: 'description',
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

  const [name, setName] = useState('');
  const [description, setDescription] = useState(null);

  const deliveryInstruction = useMemo(() => {
    return deliveryInstructions?.[0];
  }, [deliveryInstructions]);

  // store organization in state
  useEffect(() => {
    setName(deliveryInstruction?.name || '');
    setDescription(deliveryInstruction?.description || '');
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
            name,
            description,
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
            name,
            description,
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
    [organization, deliveryInstruction, isSaving, name, description]
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
          {/* Name */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.name}
              className={commonStyles.formGroup}
            >
              <Form.Label>Name</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                autoFocus
                required
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.name)}
                isInvalid={getIsInvalid(ERROR_KEYS.name)}
              />
              <Form.Text as="div">
                The name of the delivery instruction, e.g. &quot;Warehouse&quot;
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.name)}
            </Form.Group>
          </Row>

          {/* Description */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.description}
              className={commonStyles.formGroup}
            >
              <Form.Label>Description</Form.Label>
              <HtmlEditor
                value={description}
                onChange={(newValue) => setDescription(newValue)}
                isValid={getIsValid(ERROR_KEYS.description)}
                isInvalid={getIsInvalid(ERROR_KEYS.description)}
              />
              <Form.Text as="div">
                The detailed instruction a donor should follow to send you
                goods.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.description)}
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
