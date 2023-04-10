import { useDebounce } from 'use-debounce';
import styles from './register-nonprofit-form.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Loader, ArrowRightCircle } from 'react-feather';
import { useRouter } from 'next/router';
import { useNotifications, useCancelToken, isRequestCancel } from 'core/hooks';
import {
  registerAccountOrganization,
  checkOrganizationSlugIsTaken,
} from 'core/api';
import { stripProtocolFromUrl, slugify } from 'core/helpers';
import { ROOT_URL } from 'core/constants';
import type { FormEvent } from 'react';

const INPUT_ID = Object.freeze({
  name: 'name',
  slug: 'slug',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.name]: 'name',
  [INPUT_ID.slug]: 'slug',
});
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];

export function RegisterNonprofitForm() {
  const router = useRouter();
  const { showNotification } = useNotifications();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [debouncedSlug] = useDebounce(slug, 250);
  const [isSlugAvailable, setIsSlugAvailable] = useState(true);
  const [canAutofillSlug, setCanAutofillSlug] = useState(true);
  const [isCheckOrganizationSlugPending, setIsCheckOrganizationSlugPending] =
    useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const getRegistrationCancelToken = useCancelToken();
  const getCheckOrganizationSlugCancelToken = useCancelToken();

  useEffect(() => {
    if (canAutofillSlug) {
      setSlug(slugify(name));
    }
  }, [name, canAutofillSlug]);

  useEffect(() => {
    const cancelToken = getCheckOrganizationSlugCancelToken();
    if (!debouncedSlug) {
      setIsSlugAvailable(true);
      return;
    }
    setIsCheckOrganizationSlugPending(true);
    try {
      checkOrganizationSlugIsTaken({
        organizationSlug: debouncedSlug,
        cancelToken,
      }).then((isTaken) => {
        setIsSlugAvailable(!isTaken);
        setIsCheckOrganizationSlugPending(false);
      });
    } catch (rejection) {
      if (isRequestCancel(rejection)) {
        return;
      }
      throw rejection;
    }
  }, [debouncedSlug]);

  const handleSlugChange = useCallback(
    (e: FormEvent<HTMLInputElement> & { target: HTMLInputElement }) => {
      setCanAutofillSlug(false); // once editted manually, slug can't be autofilled
      setSlug(e.target.value);
    },
    []
  );

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isSaving) {
        return;
      }

      const cancelToken = getRegistrationCancelToken();

      setIsSaving(true);
      try {
        await registerAccountOrganization({
          name,
          slug,
          cancelToken,
        });

        setErrors(null);

        // redirect to the organization management page
        router.push({
          pathname: '/private/manage-nonprofit/[organizationSlug]/page/',
          query: { organizationSlug: slug, showTour: '1' },
        });
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
            message: 'Failed to register nonprofit',
          });
        }
      }
    },
    [name, slug, showNotification, router]
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
    <Container>
      <Row>
        <Col>
          <Form
            className={styles.registerNonprofitForm}
            onSubmit={handleFormSubmit}
          >
            <Row>
              <Col>
                <h2 className={styles.header}>Register a Nonprofit</h2>
              </Col>
            </Row>

            <Row className={styles.formRow}>
              <Form.Group as={Col} controlId={INPUT_ID.name}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  size="lg"
                  type="text"
                  autoFocus
                  required
                  autoComplete="off"
                  placeholder="Start typing..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isValid={getIsValid(ERROR_KEYS.name)}
                  isInvalid={getIsInvalid(ERROR_KEYS.name)}
                />
                {getErrorsFeedback(ERROR_KEYS.name)}
              </Form.Group>
            </Row>

            <Row className={styles.formRow}>
              <Col>
                <Form.Label htmlFor={INPUT_ID.slug}>
                  Address of your page
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text
                    id="slug-address"
                    className={styles.addressDomain}
                  >
                    {stripProtocolFromUrl(ROOT_URL)}/
                  </InputGroup.Text>
                  <Form.Control
                    size="lg"
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="my-awesome-charity"
                    aria-describedby="slug-address"
                    id={INPUT_ID.slug}
                    value={slug}
                    onChange={handleSlugChange}
                    isValid={getIsValid(ERROR_KEYS.slug)}
                    isInvalid={
                      getIsInvalid(ERROR_KEYS.slug) ||
                      (!isSlugAvailable &&
                        slug !== '' &&
                        !isCheckOrganizationSlugPending)
                    }
                  />
                  {!isSlugAvailable && slug !== '' ? (
                    <Form.Control.Feedback type="invalid">
                      This address has already been taken.
                    </Form.Control.Feedback>
                  ) : (
                    getErrorsFeedback(ERROR_KEYS.slug)
                  )}
                </InputGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSaving || !isSlugAvailable || slug === ''}
                  className={styles.confirmDetailsBtn}
                >
                  <span>Continue</span>
                  {isSaving ? (
                    <Loader
                      role="status"
                      aria-hidden="true"
                      className={animationStyles.rotate}
                    />
                  ) : (
                    <ArrowRightCircle aria-hidden="true" />
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
