import styles from './corporate-donation-registration-form.module.scss';
import { useCallback, useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { registerCorporateDonation } from 'core/api';
import { useCancelToken, isRequestCancel } from 'core/hooks';
import { CorporateDonationRegistrationSuccess } from 'components/corporate-donation-registration-form/registration-success/registration-success';
import { PhoneInput } from 'components/phone-input/phone-input';
import type { FormEvent } from 'react';
import type { CountryChoice } from 'core/api/types';

const INPUT_ID = Object.freeze({
  companyName: 'companyName',
  department: 'department',
  firstName: 'firstName',
  lastName: 'lastName',
  phoneNumber: 'phoneNumber',
  email: 'email',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  stateProvinceRegion: 'stateProvinceRegion',
  zip: 'zip',
  country: 'country',
  description: 'description',
  quantityDescription: 'quantityDescription',
  numberOfPallets: 'numberOfPallets',
  estimatedValue: 'estimatedValue',
  url: 'url',
  photo: 'photo',
  agreedToTermsOfUse: 'agreedToTermsOfUse',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.companyName]: 'company_name',
  [INPUT_ID.department]: 'department',
  [INPUT_ID.firstName]: 'first_name',
  [INPUT_ID.lastName]: 'last_name',
  [INPUT_ID.phoneNumber]: 'phone_number',
  [INPUT_ID.email]: 'email',
  [INPUT_ID.addressLine1]: 'address_line1',
  [INPUT_ID.addressLine2]: 'address_line2',
  [INPUT_ID.city]: 'city',
  [INPUT_ID.stateProvinceRegion]: 'state_province_region',
  [INPUT_ID.zip]: 'zip',
  [INPUT_ID.country]: 'country',
  [INPUT_ID.description]: 'description',
  [INPUT_ID.quantityDescription]: 'quantity_description',
  [INPUT_ID.numberOfPallets]: 'number_of_pallets',
  [INPUT_ID.estimatedValue]: 'estimated_value',
  [INPUT_ID.url]: 'url',
  [INPUT_ID.photo]: 'photo',
  [INPUT_ID.agreedToTermsOfUse]: 'agreed_to_terms_of_use',
});
type ErrorKey = typeof ERROR_KEYS[keyof typeof ERROR_KEYS];

type CorporateDonationRegistrationFormProps = {
  countries: CountryChoice[];
};

export function CorporateDonationRegistrationForm({
  countries,
}: CorporateDonationRegistrationFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [companyName, setCompanyName] = useState('');
  const [department, setDepartment] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateProvinceRegion, setStateProvinceRegion] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('US');
  const [description, setDescription] = useState('');
  const [quantityDescription, setQuantityDescription] = useState('');
  const [numberOfPallets, setNumberOfPallets] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [url, setUrl] = useState('');
  const [photo, setPhoto] = useState(null);
  const [agreedToTermsOfUse, setAgreedToTermsOfUse] = useState(false);

  const getRegistrationCancelToken = useCancelToken();

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isPending) {
        return;
      }

      const cancelToken = getRegistrationCancelToken();

      setIsPending(true);
      try {
        await registerCorporateDonation({
          companyName,
          department,
          firstName,
          lastName,
          phoneNumber,
          email,
          addressLine1,
          addressLine2,
          city,
          stateProvinceRegion,
          zip,
          country,
          description,
          quantityDescription,
          numberOfPallets,
          estimatedValue,
          url,
          photo,
          agreedToTermsOfUse,
          cancelToken,
        });

        setIsPending(false);
        setIsRegistered(true);
        setErrors(null);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsPending(false);
        setIsRegistered(false);
        setErrors(rejection?.response?.data);
      }
    },
    [
      isPending,
      companyName,
      department,
      firstName,
      lastName,
      phoneNumber,
      email,
      addressLine1,
      addressLine2,
      city,
      stateProvinceRegion,
      zip,
      country,
      description,
      quantityDescription,
      numberOfPallets,
      estimatedValue,
      url,
      photo,
      agreedToTermsOfUse,
    ]
  );

  const handleFormReset = useCallback(() => {
    setIsPending(false);
    setIsRegistered(false);
    setErrors(null);

    setCompanyName('');
    setDepartment('');
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setEmail('');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setStateProvinceRegion('');
    setZip('');
    setCountry('US');
    setDescription('');
    setQuantityDescription('');
    setNumberOfPallets('');
    setEstimatedValue('');
    setUrl('');
    setPhoto(null);
    setAgreedToTermsOfUse(false);
  }, []);

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

  if (isRegistered) {
    return <CorporateDonationRegistrationSuccess onDismiss={handleFormReset} />;
  }

  return (
    <Form
      onSubmit={handleFormSubmit}
      className={styles.corporateDonationRegistrationForm}
    >
      <Row>
        <Col>
          <h2 className={styles.header}>Donor Information</h2>
        </Col>
      </Row>

      <Row>
        <Form.Group
          as={Col}
          xs={6}
          controlId={INPUT_ID.companyName}
          className={styles.formGroup}
        >
          <Form.Label>Company Name *</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            required
            autoFocus
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.companyName)}
            isInvalid={getIsInvalid(ERROR_KEYS.companyName)}
          />
          {getErrorsFeedback(ERROR_KEYS.companyName)}
        </Form.Group>
        <Form.Group
          as={Col}
          xs={6}
          controlId={INPUT_ID.department}
          className={styles.formGroup}
        >
          <Form.Label>Department</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.department)}
            isInvalid={getIsInvalid(ERROR_KEYS.department)}
          />
          {getErrorsFeedback(ERROR_KEYS.department)}
        </Form.Group>
      </Row>

      <header className={styles.sectionHeader}>
        <h5>Responsible Person</h5>
      </header>

      <Row>
        <Form.Group
          as={Col}
          xs={6}
          controlId={INPUT_ID.firstName}
          className={styles.formGroup}
        >
          <Form.Label>First Name *</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            required
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
          className={styles.formGroup}
        >
          <Form.Label>Last Name *</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            required
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
          controlId={INPUT_ID.email}
          className={styles.formGroup}
        >
          <Form.Label>Email *</Form.Label>
          <Form.Control
            size="lg"
            type="email"
            placeholder=""
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.email)}
            isInvalid={getIsInvalid(ERROR_KEYS.email)}
          />
          {getErrorsFeedback(ERROR_KEYS.email)}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId={INPUT_ID.phoneNumber}
          className={styles.formGroup}
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
          {getErrorsFeedback(ERROR_KEYS.phoneNumber)}
        </Form.Group>
      </Row>

      <header className={styles.sectionHeader}>
        <h5>Company Address</h5>
      </header>

      <Row>
        <Form.Group
          as={Col}
          xs={6}
          controlId={INPUT_ID.addressLine1}
          className={styles.formGroup}
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
          className={styles.formGroup}
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
          className={styles.formGroup}
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
          className={styles.formGroup}
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
          className={styles.formGroup}
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
          controlId={INPUT_ID.country}
          className={styles.formGroup}
        >
          <Form.Label>Country</Form.Label>
          <Form.Select
            size="lg"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.country)}
            isInvalid={getIsInvalid(ERROR_KEYS.country)}
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

      <header className={styles.sectionHeader}>
        <h5>Donation</h5>
      </header>

      <Row>
        <Form.Group
          as={Col}
          controlId={INPUT_ID.description}
          className={styles.formGroup}
        >
          <Form.Label>Donation Description *</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.description)}
            isInvalid={getIsInvalid(ERROR_KEYS.description)}
          />
          {getErrorsFeedback(ERROR_KEYS.description)}
        </Form.Group>
      </Row>

      <Row>
        <Form.Group
          as={Col}
          controlId={INPUT_ID.quantityDescription}
          className={styles.formGroup}
        >
          <Form.Label>How many individual units are you donating?</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={quantityDescription}
            onChange={(e) => setQuantityDescription(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.quantityDescription)}
            isInvalid={getIsInvalid(ERROR_KEYS.quantityDescription)}
          />
          {getErrorsFeedback(ERROR_KEYS.quantityDescription)}
        </Form.Group>
      </Row>

      <Row>
        <Form.Group
          as={Col}
          sm={6}
          controlId={INPUT_ID.numberOfPallets}
          className={styles.formGroup}
        >
          <Form.Label>Number of Cartons and/or Pallets</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={numberOfPallets}
            onChange={(e) => setNumberOfPallets(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.numberOfPallets)}
            isInvalid={getIsInvalid(ERROR_KEYS.numberOfPallets)}
          />
          {getErrorsFeedback(ERROR_KEYS.numberOfPallets)}
        </Form.Group>

        <Form.Group
          as={Col}
          sm={6}
          controlId={INPUT_ID.estimatedValue}
          className={styles.formGroup}
        >
          <Form.Label>Estimated value *</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            required
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.estimatedValue)}
            isInvalid={getIsInvalid(ERROR_KEYS.estimatedValue)}
          />
          {getErrorsFeedback(ERROR_KEYS.estimatedValue)}
        </Form.Group>
      </Row>

      <Row>
        <Form.Group
          as={Col}
          controlId={INPUT_ID.url}
          className={styles.formGroup}
        >
          <Form.Label>Link to the product info (if available)</Form.Label>
          <Form.Control
            size="lg"
            type="url"
            placeholder=""
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.url)}
            isInvalid={getIsInvalid(ERROR_KEYS.url)}
          />
          {getErrorsFeedback(ERROR_KEYS.url)}
        </Form.Group>
      </Row>

      {/* Optional photo of donation */}
      {/* <Row>
        <Col>
          <Form.Group>
            <Form.Label htmlFor="photo">Photo</Form.Label>
            <Form.Control
              type="file"
              className="form-control form-control-sm"
              id="photo"
              onChange={(e) => setPhoto(e.target.files[0])}
              isValid={getIsValid('photo')}
              isInvalid={getIsInvalid('photo')}
            />
            {getErrorsFeedback('photo')}
          </Form.Group>
        </Col>
      </Row> */}

      <Row>
        <Form.Group as={Col} controlId={INPUT_ID.agreedToTermsOfUse}>
          <Form.Check
            type="checkbox"
            id={INPUT_ID.agreedToTermsOfUse}
            name={INPUT_ID.agreedToTermsOfUse}
            label={
              <>
                <span>* I agree to the terms of use. </span>
                <Link
                  href="/terms-of-use/"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  View Terms of Use Policy
                </Link>
              </>
            }
            required
            checked={agreedToTermsOfUse}
            onChange={(e) => setAgreedToTermsOfUse(e.target.checked)}
            isValid={getIsValid(ERROR_KEYS.agreedToTermsOfUse)}
            isInvalid={getIsInvalid(ERROR_KEYS.agreedToTermsOfUse)}
            feedback={errors?.[ERROR_KEYS.agreedToTermsOfUse]}
            feedbackType={
              getIsInvalid(ERROR_KEYS.agreedToTermsOfUse) ? 'invalid' : null
            }
          />
        </Form.Group>
      </Row>

      {errors ? (
        <Row>
          <Col>
            <Alert variant="danger">Fix errors above and try again</Alert>
          </Col>
        </Row>
      ) : null}

      <Row>
        <Col>
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className={styles.confirmDetailsBtn}
          >
            Submit Info
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
