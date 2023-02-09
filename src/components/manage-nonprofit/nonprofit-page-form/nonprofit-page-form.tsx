import styles from './nonprofit-page-form.module.scss';
import commonStyles from 'styles/pages/private/common.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useEffect, useCallback, useState } from 'react';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import { useRouter } from 'next/router';
import {
  useAppDispatch,
  useAppSelector,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import {
  selectAccountOrganization,
  patchOrganization,
} from 'core/store/slices/account-organization';
import { updateAccountOrganization } from 'core/api';
import { ImageUploadInput } from 'components/image-upload-input/image-upload-input';
import { ROOT_URL } from 'core/constants';
import type { FormEvent } from 'react';
import type { ImageListType } from 'react-images-uploading';

const INPUT_ID = Object.freeze({
  name: 'name',
  slug: 'slug',
  logo: 'logo',
  banner: 'banner',
  url: 'url',
  metaDescription: 'metaDescription',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.name]: 'name',
  [INPUT_ID.slug]: 'slug',
  [INPUT_ID.logo]: 'logo',
  [INPUT_ID.banner]: 'banner',
  [INPUT_ID.url]: 'url',
  [INPUT_ID.metaDescription]: 'meta_description',
});
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];

export function NonprofitPageForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showNotification } = useNotifications();

  const { organization } = useAppSelector(selectAccountOrganization);

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState<ImageListType>([]);
  const [banner, setBanner] = useState<ImageListType>([]);
  const [url, setUrl] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // store organization in state
  useEffect(() => {
    setName(organization?.name || '');
    setSlug(organization?.slug || '');
    setLogo(organization?.logo ? [{ dataURL: organization.logo }] : []);
    setBanner(organization?.banner ? [{ dataURL: organization.banner }] : []);
    setUrl(organization?.url || '');
    setMetaDescription(organization?.meta_description || '');
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
        const response = await updateAccountOrganization({
          originalSlug: organization.slug,
          name,
          slug,
          logo: logo?.length ? logo[0]?.file || null : '',
          banner: banner?.length ? banner[0]?.file || null : '',
          url,
          metaDescription,
          cancelToken,
        });

        setErrors(null);
        setIsSaving(false);
        showNotification({
          isSuccess: true,
          message: 'Page details saved successfully',
        });

        // update organization in store
        dispatch(patchOrganization(response.data));

        // redirect to the Details page with the updated slug
        if (organization.slug !== slug) {
          router.replace(
            { query: { organizationSlug: slug } },
            undefined,
            { shallow: true } // do not run getServerSideProps
          );
        }
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
            'Failed to update nonprofit page details',
        });
      }

      setIsSaving(false);
    },
    [organization, isSaving, name, slug, logo, banner, url, metaDescription]
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
              <Form.Label>Name *</Form.Label>
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
              {getErrorsFeedback(ERROR_KEYS.name)}
            </Form.Group>
          </Row>

          {/* Slug */}
          <Row>
            <Col className={commonStyles.formGroup}>
              <Form.Label htmlFor={INPUT_ID.slug}>Page address *</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  id="slug-address"
                  className={styles.addressDomain}
                >
                  {ROOT_URL}/
                </InputGroup.Text>
                <Form.Control
                  size="lg"
                  type="text"
                  required
                  autoComplete="off"
                  aria-describedby="slug-address"
                  id={INPUT_ID.slug}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  isValid={getIsValid(ERROR_KEYS.slug)}
                  isInvalid={getIsInvalid(ERROR_KEYS.slug)}
                />
                {getErrorsFeedback(ERROR_KEYS.slug)}
              </InputGroup>
            </Col>
          </Row>

          {/* Logo */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.logo}
              className={commonStyles.formGroup}
            >
              <Form.Label>Logo</Form.Label>
              <ImageUploadInput
                value={logo}
                onChange={(image) => setLogo(image)}
                isInvalid={getIsInvalid(ERROR_KEYS.logo)}
              />
              {getErrorsFeedback(ERROR_KEYS.logo)}
            </Form.Group>
          </Row>

          {/* Banner */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.banner}
              className={commonStyles.formGroup}
            >
              <Form.Label>Banner</Form.Label>
              <ImageUploadInput
                value={banner}
                onChange={(image) => setBanner(image)}
                isInvalid={getIsInvalid(ERROR_KEYS.banner)}
              />
              <Form.Text as="div" id="metaDescriptionHelpBlock">
                {`A cover photo for your organization page. Optional.`}
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.banner)}
            </Form.Group>
          </Row>

          {/* URL */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.url}
              className={commonStyles.formGroup}
            >
              <Form.Label>Website</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                autoComplete="off"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.url)}
                isInvalid={getIsInvalid(ERROR_KEYS.url)}
              />
              <Form.Text as="div" id="metaDescriptionHelpBlock">
                {`The link to your organization's website outside of Shortage. Optional.`}
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.url)}
            </Form.Group>
          </Row>

          {/* Meta description */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.metaDescription}
              className={commonStyles.formGroup}
            >
              <Form.Label>Meta description</Form.Label>
              <Form.Control
                as="textarea"
                size="lg"
                type="text"
                autoComplete="off"
                placeholder=""
                value={url}
                onChange={(e) => setMetaDescription(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.metaDescription)}
                isInvalid={getIsInvalid(ERROR_KEYS.metaDescription)}
                aria-describedby="metaDescriptionHelpBlock"
              />
              <Form.Text as="div" id="metaDescriptionHelpBlock">
                {`This value will be used as content of <meta property="description" /> tag. It is useful for SEO. Optional.`}
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.metaDescription)}
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
