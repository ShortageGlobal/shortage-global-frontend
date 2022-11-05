import styles from './donation-details-form.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useMemo, useCallback, useState } from 'react';
import { Row, Col, Form, Button, Collapse } from 'react-bootstrap';
import { Loader, User } from 'react-feather';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as fbq from 'core/tracking/fpixel';
import { useUser, useCart, isRequestCancel } from 'core/hooks';
import { PhoneInput } from 'components/phone-input/phone-input';
import { PAGE_KEY } from 'core/constants';
import type { FormEvent } from 'react';
import type { Cart, CountryChoice } from 'core/api/types';

const ERROR_KEYS = Object.freeze({
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  EMAIL: 'email',
  PHONE_NUMBER: 'phone_number',
  NEED_TAX_DEDUCTION: 'need_tax_deduction',
  AGREED_TO_TERMS_OF_USE: 'agreed_to_terms_of_use',
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
  const { profile } = useUser();

  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [firstName, setFirstName] = useState(() => cart.first_name || '');
  const [lastName, setLastName] = useState(() => cart.last_name || '');
  const [email, setEmail] = useState(() => cart.email || '');
  const [phoneNumber, setPhoneNumber] = useState(() => cart.phone_number || '');
  const [agreedToTermsOfUse, setAgreedToTermsOfUse] = useState(
    () => cart?.agreed_to_terms_of_use || !!profile // if there is profile, then the user has already accepted the terms
  );
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

  const isPopulateFromProfileAvailable = useMemo(() => {
    return (
      profile &&
      ((profile?.firstName && profile?.firstName !== firstName) ||
        (profile?.lastName && profile?.lastName !== lastName) ||
        (profile?.email && profile?.email !== email) ||
        (profile?.phoneNumber && profile?.phoneNumber !== phoneNumber))
    );
  }, [profile, firstName, lastName, email, phoneNumber]);

  const handlePopulateFromProfile = useCallback(() => {
    setFirstName(profile?.firstName || firstName);
    setLastName(profile?.lastName || lastName);
    setEmail(profile?.email || email);
    setPhoneNumber(profile?.phoneNumber || phoneNumber);
  }, [profile, firstName, lastName, email, phoneNumber]);

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsPending(true);
      fbq.custom('SubmitDonationDetails');

      try {
        await updateCart({
          firstName,
          lastName,
          email,
          phoneNumber,
          agreedToTermsOfUse,
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
      agreedToTermsOfUse,
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

        {profile ? (
          <Button
            variant="outline-dark"
            className={styles.populateFromProfileBtn}
            onClick={handlePopulateFromProfile}
            disabled={!isPopulateFromProfileAvailable}
          >
            <User />
            <span>Populate from profile</span>
          </Button>
        ) : null}
      </header>

      <Row>
        <Form.Group
          as={Col}
          xs={6}
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
            isValid={getIsValid(ERROR_KEYS.FIRST_NAME)}
            isInvalid={getIsInvalid(ERROR_KEYS.FIRST_NAME)}
          />
          {getErrorsFeedback(ERROR_KEYS.FIRST_NAME)}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
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
            isValid={getIsValid(ERROR_KEYS.LAST_NAME)}
            isInvalid={getIsInvalid(ERROR_KEYS.LAST_NAME)}
          />
          {getErrorsFeedback(ERROR_KEYS.LAST_NAME)}
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
            autoFocus
            type="email"
            placeholder=""
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isValid={getIsValid(ERROR_KEYS.EMAIL)}
            isInvalid={getIsInvalid(ERROR_KEYS.EMAIL)}
          />
          {getErrorsFeedback(ERROR_KEYS.EMAIL)}
        </Form.Group>

        <Form.Group
          as={Col}
          xs={6}
          controlId="phoneNumber"
          className={styles.formGroup}
        >
          <Form.Label>Phone Number {needTaxDeduction ? ' *' : null}</Form.Label>
          <PhoneInput
            value={phoneNumber}
            inputProps={{ id: 'phoneNumber' }}
            inputClass="form-control-lg"
            isValid={getIsValid(ERROR_KEYS.PHONE_NUMBER)}
            isInvalid={getIsInvalid(ERROR_KEYS.PHONE_NUMBER)}
            onChange={(phone) => setPhoneNumber(phone)}
          />
          {getErrorsFeedback(ERROR_KEYS.PHONE_NUMBER)}
        </Form.Group>
      </Row>

      <header className={styles.sectionHeader}>
        <h5>Do you need tax deduction?</h5>
      </header>

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

      <Collapse in={needTaxDeduction}>
        <Row>
          <Form.Group
            as={Col}
            xs={6}
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
              isValid={getIsValid(ERROR_KEYS.ADDRESS_LINE1)}
              isInvalid={getIsInvalid(ERROR_KEYS.ADDRESS_LINE1)}
            />
            {getErrorsFeedback(ERROR_KEYS.ADDRESS_LINE1)}
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
              isValid={getIsValid(ERROR_KEYS.ADDRESS_LINE2)}
              isInvalid={getIsInvalid(ERROR_KEYS.ADDRESS_LINE2)}
            />
            {getErrorsFeedback(ERROR_KEYS.ADDRESS_LINE2)}
          </Form.Group>

          <Form.Group
            as={Col}
            xs={6}
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
              isValid={getIsValid(ERROR_KEYS.CITY)}
              isInvalid={getIsInvalid(ERROR_KEYS.CITY)}
            />
            {getErrorsFeedback(ERROR_KEYS.CITY)}
          </Form.Group>

          <Form.Group
            as={Col}
            xs={6}
            controlId="stateProvinceRegion"
            className={styles.formGroup}
          >
            <Form.Label>State / Province *</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder=""
              required={needTaxDeduction}
              value={stateProvinceRegion}
              onChange={(e) => setStateProvinceRegion(e.target.value)}
              isValid={getIsValid(ERROR_KEYS.CITY)}
              isInvalid={getIsInvalid(ERROR_KEYS.CITY)}
            />
            {getErrorsFeedback(ERROR_KEYS.CITY)}
          </Form.Group>

          <Form.Group
            as={Col}
            xs={6}
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
              isValid={getIsValid(ERROR_KEYS.ZIP)}
              isInvalid={getIsInvalid(ERROR_KEYS.ZIP)}
            />
            {getErrorsFeedback(ERROR_KEYS.ZIP)}
          </Form.Group>

          <Form.Group
            as={Col}
            xs={6}
            controlId="country"
            className={styles.formGroup}
          >
            <Form.Label>Country *</Form.Label>
            <Form.Select
              size="lg"
              value={country}
              required={needTaxDeduction}
              onChange={(e) => setCountry(e.target.value)}
              isValid={getIsValid(ERROR_KEYS.COUNTRY)}
              isInvalid={getIsInvalid(ERROR_KEYS.COUNTRY)}
            >
              {countries?.map(({ value, display_name }) => (
                <option key={value} value={value}>
                  {display_name}
                </option>
              ))}
            </Form.Select>
            {getErrorsFeedback(ERROR_KEYS.COUNTRY)}
          </Form.Group>
        </Row>
      </Collapse>

      <Row>
        <Form.Group
          as={Col}
          controlId={ERROR_KEYS.AGREED_TO_TERMS_OF_USE}
          className={styles.termsOfUseCheckboxCol}
        >
          <Form.Check
            type="checkbox"
            id={ERROR_KEYS.AGREED_TO_TERMS_OF_USE}
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
            isValid={getIsValid(ERROR_KEYS.AGREED_TO_TERMS_OF_USE)}
            isInvalid={getIsInvalid(ERROR_KEYS.AGREED_TO_TERMS_OF_USE)}
            feedback={errors?.[ERROR_KEYS.AGREED_TO_TERMS_OF_USE]}
            feedbackType={
              getIsInvalid(ERROR_KEYS.AGREED_TO_TERMS_OF_USE) ? 'invalid' : null
            }
            onChange={(e) => {
              setErrors(null);
              setAgreedToTermsOfUse(e.target.checked);
            }}
          />
        </Form.Group>
      </Row>

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
