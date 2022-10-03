import styles from './donation-details-form.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useCallback, useState } from 'react';
import { Row, Col, Form, Accordion, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import { useRouter } from 'next/router';
import { useCart, isRequestCancel } from 'app/hooks';
import { PhoneInput } from 'components/phone-input/phone-input';
import { PAGE_KEY } from 'app/constants';
import type { FormEvent } from 'react';
import type { Cart, CountryChoice } from 'app/api/types';

const ERROR_KEYS = Object.freeze({
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  EMAIL: 'email',
  PHONE_NUMBER: 'phone_number',
  NEED_TAX_DEDUCTION: 'need_tax_deduction',
  ADDRESS_LINE1: 'address_line1',
  ADDRESS_LINE2: 'address_line2',
  CITY: 'city',
  STATE_PROVINCE_REGION: 'state_province_region',
  ZIP: 'zip',
  COUNTRY: 'country',
});
type ErrorKey = typeof ERROR_KEYS[keyof typeof ERROR_KEYS];

type DonationDetailsFormProps = {
  cart: Cart;
  countries: CountryChoice[];
};

export function DonationDetailsForm({
  cart,
  countries,
}: DonationDetailsFormProps) {
  const router = useRouter();

  const { updateCart } = useCart();

  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [firstName, setFirstName] = useState(() => cart.first_name || '');
  const [lastName, setLastName] = useState(() => cart.last_name || '');
  const [email, setEmail] = useState(() => cart.email || '');
  const [phoneNumber, setPhoneNumber] = useState(() => cart.phone_number || '');
  const [needTaxDeduction, setNeedTaxDeduction] = useState(
    () => cart.need_tax_deduction
  );
  const [addressLine1, setAddressLine1] = useState(
    () => cart.address_line1 || ''
  );
  const [addressLine2, setAddressLine2] = useState(
    () => cart.address_line2 || ''
  );
  const [city, setCity] = useState(() => cart.city || '');
  const [stateProvinceRegion, setStateProvinceRegion] = useState(
    () => cart.state_province_region || ''
  );
  const [zip, setZip] = useState(() => cart.zip || '');
  const [country, setCountry] = useState(() => cart.country || 'US');

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setIsPending(true);
      try {
        await updateCart({
          firstName,
          lastName,
          email,
          phoneNumber,
          needTaxDeduction,
          addressLine1,
          addressLine2,
          city,
          stateProvinceRegion,
          zip,
          country,
        });

        setErrors(null);

        // Redirect to cart page or back to the page we were redirected from
        switch (router.query.next) {
          case PAGE_KEY.PACKAGE_REGISTRATION: {
            router.push({
              pathname: '/organizations/[organizationSlug]/packages',
              query: { organizationSlug: router.query.nextOrganizationSlug },
            });
            break;
          }
          case PAGE_KEY.DONATION_CART:
          default: {
            router.push({ pathname: '/donation/details/cart' });
            break;
          }
        }
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsPending(false);
        setErrors(rejection?.response?.data);
      }
    },
    [
      updateCart,
      firstName,
      lastName,
      email,
      phoneNumber,
      needTaxDeduction,
      addressLine1,
      addressLine2,
      city,
      stateProvinceRegion,
      zip,
      country,
      router,
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
    <Form onSubmit={handleFormSubmit} className={styles.donationDetailsForm}>
      <h2 className={styles.header}>Donation Details</h2>

      <header className={styles.sectionHeader}>
        <h5>Personal Details</h5>

        <p>
          We need your personal information in case there are any issues with
          the delivery of the package.
        </p>
      </header>

      <Row>
        <Form.Group
          as={Col}
          md={6}
          controlId="firstName"
          className={styles.formGroup}
        >
          <Form.Label>First Name {needTaxDeduction ? ' *' : null}</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            required={needTaxDeduction}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            isValid={getIsValid('first_name')}
            isInvalid={getIsInvalid('first_name')}
          />
          {getErrorsFeedback('first_name')}
        </Form.Group>

        <Form.Group
          as={Col}
          md={6}
          controlId="lastName"
          className={styles.formGroup}
        >
          <Form.Label>Last Name {needTaxDeduction ? ' *' : null}</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder=""
            required={needTaxDeduction}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            isValid={getIsValid('last_name')}
            isInvalid={getIsInvalid('last_name')}
          />
          {getErrorsFeedback('last_name')}
        </Form.Group>

        <Form.Group
          as={Col}
          md={6}
          controlId="email"
          className={styles.formGroup}
        >
          <Form.Label>Email *</Form.Label>
          <Form.Control
            size="lg"
            autoFocus
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
          md={6}
          controlId="phoneNumber"
          className={styles.formGroup}
        >
          <Form.Label>Phone Number {needTaxDeduction ? ' *' : null}</Form.Label>
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
        <h5>Do you need tax deduction?</h5>
      </header>

      <Accordion activeKey={needTaxDeduction ? 'open' : 'collapsed'}>
        <Row>
          <Form.Group
            as={Col}
            controlId="needTaxDeduction"
            className={styles.formGroup}
          >
            <Form.Check
              type="checkbox"
              id="needTaxDeduction"
              label={'Request tax deduction'}
              checked={needTaxDeduction}
              onChange={(e) => {
                setErrors(null);
                setNeedTaxDeduction(e.target.checked);
              }}
            />
          </Form.Group>
        </Row>

        <Accordion.Collapse eventKey="open">
          <Row>
            <Form.Group
              as={Col}
              md={6}
              controlId="addressLine1"
              className={styles.formGroup}
            >
              <Form.Label>Address Line 1 *</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder=""
                required={needTaxDeduction}
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                isValid={getIsValid('address_line1')}
                isInvalid={getIsInvalid('address_line1')}
              />
              {getErrorsFeedback('address_line1')}
            </Form.Group>

            <Form.Group
              as={Col}
              md={6}
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
              md={6}
              controlId="city"
              className={styles.formGroup}
            >
              <Form.Label>City *</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder=""
                required={needTaxDeduction}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                isValid={getIsValid('city')}
                isInvalid={getIsInvalid('city')}
              />
              {getErrorsFeedback('city')}
            </Form.Group>

            <Form.Group
              as={Col}
              md={6}
              controlId="stateProvinceRegion"
              className={styles.formGroup}
            >
              <Form.Label>State / Province / Region *</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder=""
                required={needTaxDeduction}
                value={stateProvinceRegion}
                onChange={(e) => setStateProvinceRegion(e.target.value)}
                isValid={getIsValid('state_province_region')}
                isInvalid={getIsInvalid('state_province_region')}
              />
              {getErrorsFeedback('state_province_region')}
            </Form.Group>

            <Form.Group
              as={Col}
              md={6}
              controlId="zip"
              className={styles.formGroup}
            >
              <Form.Label>Zip *</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder=""
                required={needTaxDeduction}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                isValid={getIsValid('zip')}
                isInvalid={getIsInvalid('zip')}
              />
              {getErrorsFeedback('zip')}
            </Form.Group>

            <Form.Group
              as={Col}
              md={6}
              controlId="country"
              className={styles.formGroup}
            >
              <Form.Label>Country *</Form.Label>
              <Form.Select
                size="lg"
                value={country}
                required={needTaxDeduction}
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
        </Accordion.Collapse>
      </Accordion>

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
            {isPending ? (
              <Loader
                role="status"
                aria-hidden="true"
                className={animationStyles.rotate}
              />
            ) : null}
            <span>Proceed</span>
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
