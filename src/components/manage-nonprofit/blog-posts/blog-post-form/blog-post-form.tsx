import commonStyles from 'styles/pages/private/common.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useEffect, useCallback, useState } from 'react';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import { useRouter } from 'next/router';
import {
  useAppSelector,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import {
  createAccountOrganizationBlogPost,
  updateAccountOrganizationBlogPost,
} from 'core/api';
import { stripProtocolFromUrl, slugify } from 'core/helpers';
import { ImageUploadInput } from 'components/image-upload-input/image-upload-input';
import { HtmlEditor } from 'components/html-editor/html-editor';
import { FormControlExample } from 'components/form-control-example/form-control-example';
import { ROOT_URL } from 'core/constants';
import type { FormEvent } from 'react';
import type { ImageListType } from 'react-images-uploading';
import type { AccountBlogPost } from 'core/api/types';

const INPUT_ID = Object.freeze({
  title: 'title',
  slug: 'slug',
  image: 'image',
  content: 'content',
  metaDescription: 'metaDescription',
  isDraft: 'isDraft',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.title]: 'title',
  [INPUT_ID.slug]: 'slug',
  [INPUT_ID.image]: 'image',
  [INPUT_ID.content]: 'price',
  [INPUT_ID.metaDescription]: 'meta_description',
  [INPUT_ID.isDraft]: 'is_draft',
});
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];

type BlogPostFormProps = {
  blogPost?: AccountBlogPost;
};

export function BlogPostForm({ blogPost }: BlogPostFormProps = {}) {
  const router = useRouter();
  const { showNotification } = useNotifications();

  const { organization } = useAppSelector(selectAccountOrganization);

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugPristine, setIsSlugPristine] = useState(false);
  const [image, setImage] = useState<ImageListType>([]);
  const [content, setContent] = useState(null);
  const [metaDescription, setMetaDescription] = useState('');
  const [isDraft, setIsDraft] = useState<boolean>(true);

  // store blog post in state
  useEffect(() => {
    setTitle(blogPost?.title || '');
    setSlug(blogPost?.slug || '');
    setIsSlugPristine(!blogPost?.slug);
    setImage(blogPost?.image ? [{ dataURL: blogPost.image }] : []);
    setContent(blogPost?.content || '');
    setMetaDescription(blogPost?.meta_description || '');
    setIsDraft(blogPost?.is_draft ?? true);
  }, [blogPost]);

  // autofill slug based on the title if slug wasn't edited
  useEffect(() => {
    if (isSlugPristine) {
      setSlug(slugify(title));
    }
  }, [title, isSlugPristine]);

  const getAccountBlogPostCancelToken = useCancelToken();

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isSaving) {
        return;
      }

      setIsSaving(true);

      const cancelToken = getAccountBlogPostCancelToken();

      try {
        if (!blogPost) {
          const response = await createAccountOrganizationBlogPost({
            organizationSlug: organization.slug,
            title,
            slug,
            image: image?.length ? image[0]?.file || null : '',
            content,
            metaDescription,
            isDraft,
            cancelToken,
          });

          // redirect to the blog posts edit
          router.push({
            pathname:
              '/private/manage-nonprofit/[organizationSlug]/impact-stories/[blogPostId]/',
            query: {
              organizationSlug: organization.slug,
              blogPostId: response.data.uuid,
            },
          });
        } else {
          await updateAccountOrganizationBlogPost({
            organizationSlug: organization.slug,
            blogPostUuid: blogPost.uuid,
            title,
            slug,
            image: image?.length ? image[0]?.file || null : '',
            content,
            metaDescription,
            isDraft,
            cancelToken,
          });
          setIsSaving(false);
        }

        setErrors(null);
        showNotification({
          isSuccess: true,
          message: 'Impact story saved successfully',
        });
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        const rejectionErrors = rejection?.response?.data;
        if (rejectionErrors) {
          setErrors(rejectionErrors);
        }
        setIsSaving(false);
        showNotification({
          isFailure: true,
          message: rejectionErrors?.details || 'Failed to save Impact Story',
        });
      }
    },
    [
      organization,
      blogPost,
      isSaving,
      title,
      slug,
      image,
      content,
      metaDescription,
      isDraft,
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
          {/* Name */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.title}
              className={commonStyles.formGroup}
            >
              <Form.Label>Name</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                autoFocus
                required
                autoComplete="off"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.title)}
                isInvalid={getIsInvalid(ERROR_KEYS.title)}
              />
              {getErrorsFeedback(ERROR_KEYS.title)}
            </Form.Group>
          </Row>

          {/* Slug */}
          <Row>
            <Col className={commonStyles.formGroup}>
              <Form.Label htmlFor={INPUT_ID.slug}>Page address</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  id="slug-address"
                  className={commonStyles.addressDomain}
                >
                  {`${stripProtocolFromUrl(ROOT_URL)}/<...>/impact-stories/`}
                </InputGroup.Text>
                <Form.Control
                  size="lg"
                  type="text"
                  required
                  autoComplete="off"
                  aria-describedby="slug-address"
                  id={INPUT_ID.slug}
                  value={slug}
                  onChange={(e) => {
                    setIsSlugPristine(false);
                    setSlug(e.target.value);
                  }}
                  isValid={getIsValid(ERROR_KEYS.slug)}
                  isInvalid={getIsInvalid(ERROR_KEYS.slug)}
                />
                {getErrorsFeedback(ERROR_KEYS.slug)}
              </InputGroup>
            </Col>
          </Row>

          {/* Image */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.image}
              className={commonStyles.formGroup}
            >
              <Form.Label>Image</Form.Label>
              <ImageUploadInput
                value={image}
                onChange={(image) => setImage(image)}
                isInvalid={getIsInvalid(ERROR_KEYS.image)}
                helpText="Illustration of the Impact Story."
              />
              {getErrorsFeedback(ERROR_KEYS.image)}
            </Form.Group>
          </Row>

          {/* Content */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.content}
              className={commonStyles.formGroup}
            >
              <Form.Label>Content</Form.Label>
              <HtmlEditor
                value={content}
                onChange={(newValue) => setContent(newValue)}
              />
              {getErrorsFeedback(ERROR_KEYS.content)}
            </Form.Group>
          </Row>

          {/* Meta description */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.metaDescription}
              className={commonStyles.formGroup}
            >
              <Form.Label>
                <span>Meta description</span>
                <FormControlExample
                  triggerClassname="ms-3"
                  example={`${organization.name} is thankful for a generous donation.`}
                  onApply={(example) => setMetaDescription(example)}
                />
              </Form.Label>
              <Form.Control
                as="textarea"
                size="lg"
                type="text"
                autoComplete="off"
                placeholder=""
                rows={4}
                maxLength={200}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.metaDescription)}
                isInvalid={getIsInvalid(ERROR_KEYS.metaDescription)}
                aria-describedby="metaDescriptionHelpBlock"
              />
              <Form.Text as="div" id="metaDescriptionHelpBlock">
                Meta description will be used for link sharing. Optional.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.metaDescription)}
            </Form.Group>
          </Row>

          {/* Is draft */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.isDraft}
              className={commonStyles.formGroup}
            >
              <Form.Check
                type="checkbox"
                checked={!isDraft}
                label="Ready to be published?"
                onChange={(e) => setIsDraft(!e.target.checked)}
                isValid={getIsValid(ERROR_KEYS.isDraft)}
                isInvalid={getIsInvalid(ERROR_KEYS.isDraft)}
                aria-describedby="isDraftHelpBlock"
              />
              <Form.Text as="div" id="isDraftHelpBlock">
                If checked, the Impact Story is posted on your page.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.isDraft)}
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
