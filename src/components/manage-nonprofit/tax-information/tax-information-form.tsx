import commonStyles from 'styles/pages/private/common.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useEffect, useCallback, useState, useMemo } from 'react';
import { Row, Col, Form, Alert, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import {
  useAppDispatch,
  useAppSelector,
  useNotifications,
  useCancelToken,
  isRequestCancel,
  useNavigationLock,
} from 'core/hooks';
import {
  selectAccountOrganization,
  patchOrganization,
} from 'core/store/slices/account-organization';
import { updateAccountOrganization } from 'core/api';
import { bothEmptyOrEqual } from 'core/helpers';
import { PhoneInput } from 'components/phone-input/phone-input';
import { ImageUploadInput } from 'components/image-upload-input/image-upload-input';
import { FormControlExample } from 'components/form-control-example/form-control-example';
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
  representativeUrl: 'representativeUrl',
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
  [INPUT_ID.representativeUrl]: 'representative_url',
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
  const dispatch = useAppDispatch();
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
  const [representativeUrl, setRepresentativeUrl] = useState('');
  const [representativePhoneNumber, setRepresentativePhoneNumber] =
    useState('');
  const [representativeSignature, setRepresentativeSignature] =
    useState<ImageListType>([]);
  const [receiptPreamble, setReceiptPreamble] = useState('');
  const [receiptLegalInformation, setReceiptLegalInformation] = useState('');

  const defaultValues = useMemo(() => {
    return Object.freeze({
      einNumber: organization?.ein_number || '',
      addressLine1: organization?.address_line1 || '',
      addressLine2: organization?.address_line2 || '',
      city: organization?.city || '',
      stateProvinceRegion: organization?.state_province_region || '',
      zip: organization?.zip || '',
      country: organization?.country || '',
      representativeFirstName: organization?.representative_first_name || '',
      representativeLastName: organization?.representative_last_name || '',
      representativeEmail: organization?.representative_email || '',
      representativeUrl: organization?.representative_url || '',
      representativePhoneNumber:
        organization?.representative_phone_number || '',
      representativeSignature: organization?.representative_signature
        ? [{ dataURL: organization.representative_signature }]
        : [],
      receiptPreamble: organization?.tax_deduction_receipt_preamble || '',
      receiptLegalInformation:
        organization?.tax_deduction_receipt_legal_information || '',
    });
  }, [organization]);

  // store tax information in state
  useEffect(() => {
    setEinNumber(defaultValues.einNumber);
    setAddressLine1(defaultValues.addressLine1);
    setAddressLine2(defaultValues.addressLine2);
    setCity(defaultValues.city);
    setStateProvinceRegion(defaultValues.stateProvinceRegion);
    setZip(defaultValues.zip);
    setCountry(defaultValues.country);
    setRepresentativeFirstName(defaultValues.representativeFirstName);
    setRepresentativeLastName(defaultValues.representativeLastName);
    setRepresentativeEmail(defaultValues.representativeEmail);
    setRepresentativeUrl(defaultValues.representativeUrl);
    setRepresentativePhoneNumber(defaultValues.representativePhoneNumber);
    setRepresentativeSignature(defaultValues.representativeSignature);
    setReceiptPreamble(defaultValues.receiptPreamble);
    setReceiptLegalInformation(defaultValues.receiptLegalInformation);
  }, [defaultValues]);

  const isFormDirty = useMemo(() => {
    if (isSaving) {
      return false;
    }

    if (
      bothEmptyOrEqual(defaultValues.einNumber, einNumber) &&
      bothEmptyOrEqual(defaultValues.addressLine1, addressLine1) &&
      bothEmptyOrEqual(defaultValues.addressLine2, addressLine2) &&
      bothEmptyOrEqual(defaultValues.city, city) &&
      bothEmptyOrEqual(
        defaultValues.stateProvinceRegion,
        stateProvinceRegion
      ) &&
      bothEmptyOrEqual(defaultValues.zip, zip) &&
      bothEmptyOrEqual(defaultValues.country, country) &&
      bothEmptyOrEqual(
        defaultValues.representativeFirstName,
        representativeFirstName
      ) &&
      bothEmptyOrEqual(
        defaultValues.representativeLastName,
        representativeLastName
      ) &&
      bothEmptyOrEqual(
        defaultValues.representativeEmail,
        representativeEmail
      ) &&
      bothEmptyOrEqual(defaultValues.representativeUrl, representativeUrl) &&
      bothEmptyOrEqual(
        defaultValues.representativePhoneNumber,
        representativePhoneNumber
      ) &&
      bothEmptyOrEqual(
        defaultValues.representativeSignature[0]?.dataURL,
        representativeSignature[0]?.dataURL
      ) &&
      bothEmptyOrEqual(defaultValues.receiptPreamble, receiptPreamble) &&
      bothEmptyOrEqual(
        defaultValues.receiptLegalInformation,
        receiptLegalInformation
      )
    ) {
      return false;
    }

    return true;
  }, [
    defaultValues,
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
    representativeUrl,
    representativePhoneNumber,
    representativeSignature,
    receiptPreamble,
    receiptLegalInformation,
  ]);

  useNavigationLock(isFormDirty);

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
        const response = await updateAccountOrganization({
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
          representativeUrl,
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

        // update organization in store
        dispatch(patchOrganization(response.data));
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
      representativeUrl,
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
                Tax information is needed to generate tax deduction receipts and
                send to your donors automatically.
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
                  ...(organization.is_draft ? {} : { readOnly: true }),
                }}
                inputClass="form-control-lg"
                isValid={getIsValid(ERROR_KEYS.representativePhoneNumber)}
                isInvalid={getIsInvalid(ERROR_KEYS.representativePhoneNumber)}
                onChange={(phone) => setRepresentativePhoneNumber(phone)}
              />
              <Form.Text as="div" id="receiptLegalInformationHelpBlock">
                Optional.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.representativePhoneNumber)}
            </Form.Group>
          </Row>

          <header className={commonStyles.sectionHeader}>
            <h5>Tax Deduction Receipt Blocks</h5>
          </header>

          {/* URL */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.representativeUrl}
              className={commonStyles.formGroup}
            >
              <Form.Label>Website</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                autoComplete="off"
                placeholder="https://example.com"
                maxLength={75}
                value={representativeUrl}
                onChange={(e) => setRepresentativeUrl(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.representativeUrl)}
                isInvalid={getIsInvalid(ERROR_KEYS.representativeUrl)}
                aria-describedby="websiteHelpBlock"
                readOnly={!organization.is_draft}
              />
              <Form.Text as="div" id="websiteHelpBlock">
                {`The address of the company website to show on tax deduction receipts. Optional.`}
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.representativeUrl)}
            </Form.Group>
          </Row>

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
                helpText="A scan of the responsible person's signature. Will be used to sign tax deduction receipts. Optional."
              />
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
                maxLength={1000}
                value={receiptPreamble}
                onChange={(e) => setReceiptPreamble(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.receiptPreamble)}
                isInvalid={getIsInvalid(ERROR_KEYS.receiptPreamble)}
                aria-describedby="receiptPreambleHelpBlock"
                readOnly={!organization.is_draft}
              />
              <Form.Text as="div" id="receiptPreambleHelpBlock">
                Text added to automatically generated tax deduction receipts
                before the list of donated goods. Optional.
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
              <Form.Label>
                <span>Legal Information</span>
                <FormControlExample
                  triggerClassname="ms-3"
                  example={`
                    Please print this receipt for tax purposes. As required by the IRS
                    regulations, we provide the following information:
                    ${
                      organization.name
                    } is a 501(c)(3) not for profit organization.
                    Our federal tax identification number is ${
                      einNumber || '___'
                    }. As
                    no goods or services have been provided in connection with this gift, the
                    full amount is deductible to the fullest extent provided by law.
                  `
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()}
                  onApply={(example) => setReceiptLegalInformation(example)}
                />
              </Form.Label>
              <Form.Control
                as="textarea"
                size="lg"
                type="text"
                autoComplete="off"
                placeholder=""
                maxLength={1000}
                rows={5}
                value={receiptLegalInformation}
                onChange={(e) => setReceiptLegalInformation(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.receiptLegalInformation)}
                isInvalid={getIsInvalid(ERROR_KEYS.receiptLegalInformation)}
                aria-describedby="receiptLegalInformationHelpBlock"
                readOnly={!organization.is_draft}
              />
              <Form.Text as="div" id="receiptLegalInformationHelpBlock">
                Text added to automatically generated tax deduction receipts at
                the end of the document. Optional.
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
