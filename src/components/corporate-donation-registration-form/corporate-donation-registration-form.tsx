import styles from './corporate-donation-registration-form.module.scss';
import { useCallback, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { registerCorporateDonation } from 'core/api';
import { useCancelToken, isRequestCancel } from 'core/hooks';
import { CorporateDonationRegistrationSuccess } from 'components/corporate-donation-registration-form/registration-success/registration-success';
import { PhoneInput } from 'components/phone-input/phone-input';
import type { FormEvent } from 'react';
import type { CountryChoice } from 'core/api/types';

const ERROR_KEYS = Object.freeze({
  COMPANY_NAME: 'company_name',
  DEPARTMENT: 'department',
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  PHONE_NUMBER: 'phone_number',
  EMAIL: 'email',
  ADDRESS_LINE1: 'address_line1',
  ADDRESS_LINE2: 'address_line2',
  CITY: 'city',
  STATE_PROVINCE_REGION: 'state_province_region',
  ZIP: 'zip',
  COUNTRY: 'country',
  DESCRIPTION: 'description',
  QUANTITY_DESCRIPTION: 'quantity_description',
  NUMBER_OF_PALLETS: 'number_of_pallets',
  ESTIMATED_VALUE: 'estimated_value',
  URL: 'url',
  PHOTO: 'photo',
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
          controlId="companyName"
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
            isValid={getIsValid('company_name')}
            isInvalid={getIsInvalid('company_name')}
          />
          {getErrorsFeedback('company_name')}
        </Form.Group>
        <Form.Group
          as={Col}
          xs={6}
          controlId="department"
          className={styles.formGroup}
        >
          <Form.Label>Department</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            isValid={getIsValid('department')}
            isInvalid={getIsInvalid('department')}
          />
          {getErrorsFeedback('department')}
        </Form.Group>
      </Row>

      <header className={styles.sectionHeader}>
        <h5>Responsible Person</h5>
      </header>

      <Row>
        <Form.Group
          as={Col}
          xs={6}
          controlId="firstName"
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
            isValid={getIsValid('first_name')}
            isInvalid={getIsInvalid('first_name')}
          />
          {getErrorsFeedback('first_name')}
        </Form.Group>
        <Form.Group
          as={Col}
          xs={6}
          controlId="lastName"
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
            isValid={getIsValid('last_name')}
            isInvalid={getIsInvalid('last_name')}
          />
          {getErrorsFeedback('last_name')}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId="email"
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
            isValid={getIsValid('email')}
            isInvalid={getIsInvalid('email')}
          />
          {getErrorsFeedback('email')}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId="phoneNumber"
          className={styles.formGroup}
        >
          <Form.Label>Phone Number</Form.Label>
          <PhoneInput
            value={phoneNumber}
            inputProps={{ id: 'phoneNumber' }}
            inputClass="form-control-lg"
            isValid={getIsValid('phone_number')}
            isInvalid={getIsInvalid('phone_number')}
            onChange={(phone) => setPhoneNumber(phone)}
          />
          {getErrorsFeedback('phone_number')}
        </Form.Group>
      </Row>

      <header className={styles.sectionHeader}>
        <h5>Company Address</h5>
      </header>

      <Row>
        <Form.Group
          as={Col}
          xs={6}
          controlId="addressLine1"
          className={styles.formGroup}
        >
          <Form.Label>Address Line 1</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            isValid={getIsValid('address_line1')}
            isInvalid={getIsInvalid('address_line1')}
          />
          {getErrorsFeedback('address_line1')}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId="addressLine2"
          className={styles.formGroup}
        >
          <Form.Label>Address Line 2</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            isValid={getIsValid('address_line2')}
            isInvalid={getIsInvalid('address_line2')}
          />
          {getErrorsFeedback('address_line2')}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId="city"
          className={styles.formGroup}
        >
          <Form.Label>City</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={city}
            onChange={(e) => setCity(e.target.value)}
            isValid={getIsValid('city')}
            isInvalid={getIsInvalid('city')}
          />
          {getErrorsFeedback('city')}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId="stateProvinceRegion"
          className={styles.formGroup}
        >
          <Form.Label>State / Province</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={stateProvinceRegion}
            onChange={(e) => setStateProvinceRegion(e.target.value)}
            isValid={getIsValid('state_province_region')}
            isInvalid={getIsInvalid('state_province_region')}
          />
          {getErrorsFeedback('state_province_region')}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId="zip"
          className={styles.formGroup}
        >
          <Form.Label>Zip</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            isValid={getIsValid('zip')}
            isInvalid={getIsInvalid('zip')}
          />
          {getErrorsFeedback('zip')}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId="country"
          className={styles.formGroup}
        >
          <Form.Label>Country</Form.Label>
          <Form.Select
            size="lg"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            isValid={getIsValid('country')}
            isInvalid={getIsInvalid('country')}
          >
            {countries?.map(({ value, display_name }) => (
              <option key={value} value={value}>
                {display_name}
              </option>
            ))}
          </Form.Select>
          {getErrorsFeedback('country')}
        </Form.Group>
      </Row>

      <header className={styles.sectionHeader}>
        <h5>Donation</h5>
      </header>

      <Row>
        <Form.Group
          as={Col}
          controlId="description"
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
            isValid={getIsValid('description')}
            isInvalid={getIsInvalid('description')}
          />
          {getErrorsFeedback('description')}
        </Form.Group>
      </Row>

      <Row>
        <Form.Group
          as={Col}
          controlId="quantityDescription"
          className={styles.formGroup}
        >
          <Form.Label>How many individual units are you donating?</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={quantityDescription}
            onChange={(e) => setQuantityDescription(e.target.value)}
            isValid={getIsValid('quantity_description')}
            isInvalid={getIsInvalid('quantity_description')}
          />
          {getErrorsFeedback('quantity_description')}
        </Form.Group>
      </Row>

      <Row>
        <Form.Group
          as={Col}
          sm={6}
          controlId="numberOfPallets"
          className={styles.formGroup}
        >
          <Form.Label>Number of Cartons and/or Pallets</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            value={numberOfPallets}
            onChange={(e) => setNumberOfPallets(e.target.value)}
            isValid={getIsValid('number_of_pallets')}
            isInvalid={getIsInvalid('number_of_pallets')}
          />
          {getErrorsFeedback('number_of_pallets')}
        </Form.Group>

        <Form.Group
          as={Col}
          sm={6}
          controlId="estimatedValue"
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
            isValid={getIsValid('estimated_value')}
            isInvalid={getIsInvalid('estimated_value')}
          />
          {getErrorsFeedback('estimated_value')}
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col} controlId="url" className={styles.formGroup}>
          <Form.Label>Link to the product info (if available)</Form.Label>
          <Form.Control
            size="lg"
            type="url"
            placeholder=""
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            isValid={getIsValid('url')}
            isInvalid={getIsInvalid('url')}
          />
          {getErrorsFeedback('url')}
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

      {errors ? (
        <Row>
          <Col>
            <div className="text-danger">Fix errors above and try again</div>
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
