import commonStyles from 'styles/pages/private/common.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useEffect, useCallback, useState } from 'react';
import { Row, Col, Form, Alert, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import {
  useAppSelector,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import { updateAccountOrganization } from 'core/api';
import { PhoneInput } from 'components/phone-input/phone-input';
import { ImageUploadInput } from 'components/image-upload-input/image-upload-input';
import type { FormEvent } from 'react';
import type { ImageListType } from 'react-images-uploading';
import type { CountryChoice } from 'core/api/types';

const INPUT_ID = Object.freeze({
  einNumber: 'einNumber',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  stateProvinceRegion: 'stateProvinceRegion',
  zip: 'zip',
  country: 'country',
  representativeFirstName: 'representativeFirstName',
  representativeLastName: 'representativeLastName',
  representativeEmail: 'representativeEmail',
  representativePhoneNumber: 'representativePhoneNumber',
  representativeSignature: 'representativeSignature',
  receiptPreamble: 'receiptPreamble',
  receiptLegalInformation: 'receiptLegalInformation',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.einNumber]: 'ein_number',
  [INPUT_ID.addressLine1]: 'address_line1',
  [INPUT_ID.addressLine2]: 'address_line2',
  [INPUT_ID.city]: 'city',
  [INPUT_ID.stateProvinceRegion]: 'state_province_region',
  [INPUT_ID.zip]: 'zip',
  [INPUT_ID.country]: 'country',
  [INPUT_ID.representativeFirstName]: 'representative_first_name',
  [INPUT_ID.representativeLastName]: 'representative_last_name',
  [INPUT_ID.representativeEmail]: 'representative_email',
  [INPUT_ID.representativePhoneNumber]: 'representative_phone_number',
  [INPUT_ID.representativeSignature]: 'representative_signature',
  [INPUT_ID.receiptPreamble]: 'tax_deduction_receipt_preamble',
  [INPUT_ID.receiptLegalInformation]: 'tax_deduction_receipt_legal_information',
});
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];

type TaxInformationFormProps = {
  countries: CountryChoice[];
};

export function TaxInformationForm({ countries }: TaxInformationFormProps) {
  const { showNotification } = useNotifications();

  const { organization } = useAppSelector(selectAccountOrganization);

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [einNumber, setEinNumber] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateProvinceRegion, setStateProvinceRegion] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('US');

  const [representativeFirstName, setRepresentativeFirstName] = useState('');
  const [representativeLastName, setRepresentativeLastName] = useState('');
  const [representativeEmail, setRepresentativeEmail] = useState('');
  const [representativePhoneNumber, setRepresentativePhoneNumber] =
    useState('');
  const [representativeSignature, setRepresentativeSignature] =
    useState<ImageListType>([]);
  const [receiptPreamble, setReceiptPreamble] = useState('');
  const [receiptLegalInformation, setReceiptLegalInformation] = useState('');

  // store organization in state
  useEffect(() => {
    setEinNumber(organization?.ein_number || '');
    setAddressLine1(organization?.address_line1 || '');
    setAddressLine2(organization?.address_line2 || '');
    setCity(organization?.city || '');
    setStateProvinceRegion(organization?.state_province_region || '');
    setZip(organization?.zip || '');
    setCountry(organization?.country || '');
    setRepresentativeFirstName(organization?.representative_first_name || '');
    setRepresentativeLastName(organization?.representative_last_name || '');
    setRepresentativeEmail(organization?.representative_email || '');
    setRepresentativePhoneNumber(
      organization?.representative_phone_number || ''
    );
    setRepresentativeSignature(
      organization?.representative_signature
        ? [{ dataURL: organization.representative_signature }]
        : []
    );
    setReceiptPreamble(organization?.tax_deduction_receipt_preamble || '');
    setReceiptLegalInformation(
      organization?.tax_deduction_receipt_legal_information || ''
    );
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
          organizationSlug: organization.slug,
          einNumber,
          addressLine1,
          addressLine2,
          city,
          stateProvinceRegion,
          zip,
          country,
          representativeFirstName,
          representativeLastName,
          representativeEmail,
          representativePhoneNumber,
          representativeSignature: representativeSignature?.length
            ? representativeSignature[0]?.file || null
            : '',
          receiptPreamble,
          receiptLegalInformation,
          cancelToken,
        });
        setErrors(null);
        setIsSaving(false);
        showNotification({
          isSuccess: true,
          message: 'Tax information details saved successfully',
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
            'Failed to save tax information details',
        });
      }

      setIsSaving(false);
    },
    [
      organization,
      isSaving,
      einNumber,
      addressLine1,
      addressLine2,
      city,
      stateProvinceRegion,
      zip,
      country,
      representativeFirstName,
      representativeLastName,
      representativeEmail,
      representativePhoneNumber,
      representativeSignature,
      receiptPreamble,
      receiptLegalInformation,
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
                Tax information is needed to generate a tax deduction receipt
                through the Shortage platform and send to your donors
                automatically.
              </Alert>
            </Col>
          </Row>
          <Row>
            {/* EIN number */}
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
                autoComplete="off"
                value={einNumber}
                onChange={(e) => setEinNumber(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.einNumber)}
                isInvalid={getIsInvalid(ERROR_KEYS.einNumber)}
                readOnly={!organization.is_draft}
              />
              {getErrorsFeedback(ERROR_KEYS.einNumber)}
            </Form.Group>
          </Row>

          <header className={commonStyles.sectionHeader}>
            <h5>Company Address</h5>
          </header>

          <Row>
            {/* Address Line 1 */}
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
                readOnly={!organization.is_draft}
              />
              {getErrorsFeedback(ERROR_KEYS.addressLine1)}
            </Form.Group>

            {/* Address Line 2 */}
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
                readOnly={!organization.is_draft}
              />
              {getErrorsFeedback(ERROR_KEYS.addressLine2)}
            </Form.Group>

            {/* City */}
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
                readOnly={!organization.is_draft}
              />
              {getErrorsFeedback(ERROR_KEYS.city)}
            </Form.Group>

            {/* State / Province */}
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
                readOnly={!organization.is_draft}
              />
              {getErrorsFeedback(ERROR_KEYS.stateProvinceRegion)}
            </Form.Group>

            {/* Zip */}
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
                readOnly={!organization.is_draft}
              />
              {getErrorsFeedback(ERROR_KEYS.zip)}
            </Form.Group>

            {/* Country */}
            <Form.Group
              as={Col}
              xs={6}
              controlId={INPUT_ID.country}
              className={commonStyles.formGroup}
            >
              <Form.Label>Country</Form.Label>
              <Form.Select
                size="lg"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.country)}
                isInvalid={getIsInvalid(ERROR_KEYS.country)}
                disabled={!organization.is_draft}
              >
                {countries?.map(({ value, display_name }) => (
                  <option key={value} value={value}>
                    {display_name}
                  </option>
                ))}
              </Form.Select>
              {getErrorsFeedback(ERROR_KEYS.country)}
            </Form.Group>
          </Row>

          <header className={commonStyles.sectionHeader}>
            <h5>Responsible Person</h5>
          </header>

          <Row>
            {/* First name */}
            <Form.Group
              as={Col}
              xs={6}
              controlId={INPUT_ID.representativeFirstName}
              className={commonStyles.formGroup}
            >
              <Form.Label>First Name</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder=""
                value={representativeFirstName}
                onChange={(e) => setRepresentativeFirstName(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.representativeFirstName)}
                isInvalid={getIsInvalid(ERROR_KEYS.representativeFirstName)}
                readOnly={!organization.is_draft}
              />
              {getErrorsFeedback(ERROR_KEYS.representativeFirstName)}
            </Form.Group>

            {/* Last name */}
            <Form.Group
              as={Col}
              xs={6}
              controlId={INPUT_ID.representativeLastName}
              className={commonStyles.formGroup}
            >
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder=""
                value={representativeLastName}
                onChange={(e) => setRepresentativeLastName(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.representativeLastName)}
                isInvalid={getIsInvalid(ERROR_KEYS.representativeLastName)}
                readOnly={!organization.is_draft}
              />
              {getErrorsFeedback(ERROR_KEYS.representativeLastName)}
            </Form.Group>

            {/* Email */}
            <Form.Group
              as={Col}
              xs={6}
              controlId={INPUT_ID.representativeEmail}
              className={commonStyles.formGroup}
            >
              <Form.Label>Email</Form.Label>
              <Form.Control
                size="lg"
                type="representativeEmail"
                placeholder=""
                value={representativeEmail}
                onChange={(e) => setRepresentativeEmail(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.representativeEmail)}
                isInvalid={getIsInvalid(ERROR_KEYS.representativeEmail)}
                readOnly={!organization.is_draft}
              />
              {getErrorsFeedback(ERROR_KEYS.representativeEmail)}
            </Form.Group>

            {/* Phone number */}
            <Form.Group
              as={Col}
              xs={6}
              controlId={INPUT_ID.representativePhoneNumber}
              className={commonStyles.formGroup}
            >
              <Form.Label>Phone Number</Form.Label>
              <PhoneInput
                value={representativePhoneNumber}
                inputProps={{
                  id: 'phoneNumber',
                  ...(organization.is_draft ? {} : { readonly: 'true' }),
                }}
                inputClass="form-control-lg"
                isValid={getIsValid(ERROR_KEYS.representativePhoneNumber)}
                isInvalid={getIsInvalid(ERROR_KEYS.representativePhoneNumber)}
                onChange={(phone) => setRepresentativePhoneNumber(phone)}
              />
              {getErrorsFeedback(ERROR_KEYS.representativePhoneNumber)}
            </Form.Group>
          </Row>

          <header className={commonStyles.sectionHeader}>
            <h5>Tax Deduction Receipt Blocks</h5>
          </header>

          {/* Signature */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.representativeSignature}
              className={commonStyles.formGroup}
            >
              <Form.Label>Signature</Form.Label>
              <ImageUploadInput
                value={representativeSignature}
                onChange={(image) => setRepresentativeSignature(image)}
                isInvalid={getIsInvalid(ERROR_KEYS.representativeSignature)}
                readOnly={!organization.is_draft}
              />
              <Form.Text as="div">
                A scan of the responsible person&apos;s signature. Will be used
                to sign tax deduction receipts. Optional.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.representativeSignature)}
            </Form.Group>
          </Row>

          {/* Receipt Preamble */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.receiptPreamble}
              className={commonStyles.formGroup}
            >
              <Form.Label>Receipt Preamble</Form.Label>
              <Form.Control
                as="textarea"
                size="lg"
                type="text"
                autoComplete="off"
                placeholder=""
                maxLength={500}
                value={receiptPreamble}
                onChange={(e) => setReceiptPreamble(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.receiptPreamble)}
                isInvalid={getIsInvalid(ERROR_KEYS.receiptPreamble)}
                aria-describedby="receiptPreambleHelpBlock"
                readOnly={!organization.is_draft}
              />
              <Form.Text as="div" id="receiptPreambleHelpBlock">
                Text added to automatically generated tax deduction receipts
                before the table.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.receiptPreamble)}
            </Form.Group>
          </Row>

          {/* Receipt Footer */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.receiptLegalInformation}
              className={commonStyles.formGroup}
            >
              <Form.Label>Legal Information</Form.Label>
              <Form.Control
                as="textarea"
                size="lg"
                type="text"
                autoComplete="off"
                placeholder=""
                maxLength={500}
                value={receiptLegalInformation}
                onChange={(e) => setReceiptLegalInformation(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.receiptLegalInformation)}
                isInvalid={getIsInvalid(ERROR_KEYS.receiptLegalInformation)}
                aria-describedby="receiptLegalInformationHelpBlock"
                readOnly={!organization.is_draft}
              />
              <Form.Text as="div" id="receiptLegalInformationHelpBlock">
                Text added to automatically generated tax deduction receipts at
                the end of the document.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.receiptLegalInformation)}
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
