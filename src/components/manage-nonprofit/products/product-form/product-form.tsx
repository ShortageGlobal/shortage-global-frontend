import commonStyles from 'styles/pages/private/common.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useEffect, useCallback, useState, useMemo } from 'react';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { DollarSign, Loader } from 'react-feather';
import { useRouter } from 'next/router';
import {
  useAppSelector,
  useAppDispatch,
  useNotifications,
  useCancelToken,
  isRequestCancel,
  useNavigationLock,
} from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import { patchProduct } from 'core/store/slices/account-product';
import {
  createAccountOrganizationProduct,
  updateAccountOrganizationProduct,
} from 'core/api';
import { stripProtocolFromUrl, slugify, bothEmptyOrEqual } from 'core/helpers';
import { ImageUploadInput } from 'components/image-upload-input/image-upload-input';
import { HtmlEditor } from 'components/html-editor/html-editor';
import { PRODUCT_CATEGORY_DETAILS } from 'core/category-details';
import {
  ROOT_URL,
  PRODUCT_CATEGORY_ALL_KEY,
  PRODUCT_CATEGORY_LIST,
} from 'core/constants';
import type { FormEvent } from 'react';
import type { ImageListType } from 'react-images-uploading';
import type { AccountProduct } from 'core/api/types';

const INPUT_ID = Object.freeze({
  name: 'name',
  slug: 'slug',
  category: 'category',
  photo: 'photo',
  price: 'price',
  requestedAmount: 'requestedAmount',
  topPriority: 'topPriority',
  isPublic: 'isPublic',
  description: 'description',
  position: 'position',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.name]: 'name',
  [INPUT_ID.slug]: 'slug',
  [INPUT_ID.category]: 'category',
  [INPUT_ID.photo]: 'photo',
  [INPUT_ID.price]: 'price',
  [INPUT_ID.requestedAmount]: 'requested_amount',
  [INPUT_ID.topPriority]: 'top_priority',
  [INPUT_ID.isPublic]: 'is_public',
  [INPUT_ID.description]: 'description',
  [INPUT_ID.position]: 'position',
});
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];

type ProductFormProps = {
  product?: AccountProduct;
};

export function ProductForm({ product }: ProductFormProps = {}) {
  const router = useRouter();
  const { showNotification } = useNotifications();

  const dispatch = useAppDispatch();
  const { organization } = useAppSelector(selectAccountOrganization);

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugPristine, setIsSlugPristine] = useState(false);
  const [photo, setPhoto] = useState<ImageListType>([]);
  const [category, setCategory] = useState<AccountProduct['category'] | ''>('');
  const [price, setPrice] = useState<string | number>('1');
  const [requestedAmount, setRequestedAmount] = useState<string | number>('1');
  const [topPriority, setTopPriority] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [description, setDescription] = useState(null);
  const [position, setPosition] = useState<string | number>('0');

  const defaultValues = useMemo(() => {
    return Object.freeze({
      name: product?.name || '',
      slug: product?.slug || '',
      photo: product?.photo ? [{ dataURL: product.photo }] : [],
      category: product?.category || '',
      price: product?.price || '1',
      requestedAmount: product?.requested_amount || '1',
      topPriority: product?.top_priority || false,
      isPublic: product?.is_public,
      description: product?.description || '',
      position: product?.position || '0',
    });
  }, [product]);

  // store product in state
  useEffect(() => {
    setName(defaultValues.name);
    setSlug(defaultValues.slug);
    setIsSlugPristine(!defaultValues.slug);
    setPhoto(defaultValues.photo);
    setCategory(defaultValues.category);
    setPrice(defaultValues.price);
    setRequestedAmount(defaultValues.requestedAmount);
    setTopPriority(defaultValues.topPriority);
    setIsPublic(defaultValues.isPublic);
    setDescription(defaultValues.description);
    setPosition(defaultValues.position);
  }, [defaultValues]);

  // autofill slug based on the name if slug wasn't edited
  useEffect(() => {
    if (isSlugPristine) {
      setSlug(slugify(name));
    }
  }, [name, isSlugPristine]);

  const isFormDirty = useMemo(() => {
    if (isSaving) {
      return false;
    }

    if (
      bothEmptyOrEqual(defaultValues.name, name) &&
      bothEmptyOrEqual(defaultValues.slug, slug) &&
      bothEmptyOrEqual(defaultValues.photo[0]?.dataURL, photo?.[0]?.dataURL) &&
      bothEmptyOrEqual(defaultValues.category, category) &&
      bothEmptyOrEqual(Number(defaultValues.price), Number(price)) &&
      bothEmptyOrEqual(
        Number(defaultValues.requestedAmount),
        Number(requestedAmount)
      ) &&
      bothEmptyOrEqual(defaultValues.topPriority, topPriority) &&
      bothEmptyOrEqual(defaultValues.isPublic, isPublic) &&
      bothEmptyOrEqual(defaultValues.description, description) &&
      bothEmptyOrEqual(Number(defaultValues.position), Number(position))
    ) {
      return false;
    }

    return true;
  }, [
    defaultValues,
    isSaving,
    name,
    slug,
    photo,
    category,
    price,
    requestedAmount,
    topPriority,
    isPublic,
    description,
    position,
  ]);

  useNavigationLock(isFormDirty);

  const getAccountProductCancelToken = useCancelToken();

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isSaving) {
        return;
      }

      setIsSaving(true);

      const cancelToken = getAccountProductCancelToken();

      try {
        if (!product) {
          const response = await createAccountOrganizationProduct({
            organizationSlug: organization.slug,
            name,
            slug,
            category: category as AccountProduct['category'],
            photo: photo?.length ? photo[0]?.file || null : '',
            price: Number(price),
            requestedAmount: Number(requestedAmount),
            topPriority,
            isPublic,
            description,
            position: Number(position),
            cancelToken,
          });

          // redirect to the product edit
          router.push({
            pathname:
              '/private/manage-nonprofit/[organizationSlug]/requested-goods/[productId]/',
            query: {
              organizationSlug: organization.slug,
              productId: response.data.id,
            },
          });
        } else {
          const response = await updateAccountOrganizationProduct({
            organizationSlug: organization.slug,
            productId: product.id,
            name,
            slug,
            category: category as AccountProduct['category'],
            photo: photo?.length ? photo[0]?.file || null : '',
            price: Number(price),
            requestedAmount: Number(requestedAmount),
            topPriority,
            isPublic,
            description,
            position: Number(position),
            cancelToken,
          });
          dispatch(patchProduct(response.data));
          setIsSaving(false);
        }

        setErrors(null);
        showNotification({
          isSuccess: true,
          message: 'Requested good details saved successfully',
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
          message:
            rejectionErrors?.details || 'Failed to save requested good details',
        });
      }
    },
    [
      organization,
      product,
      isSaving,
      name,
      slug,
      category,
      photo,
      price,
      requestedAmount,
      topPriority,
      isPublic,
      description,
      position,
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
                readOnly={!organization.is_draft}
              />
              {getErrorsFeedback(ERROR_KEYS.name)}
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
                  {`${stripProtocolFromUrl(ROOT_URL)}/<...>/products/`}
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
                  readOnly={!organization.is_draft}
                />
                {getErrorsFeedback(ERROR_KEYS.slug)}
              </InputGroup>
            </Col>
          </Row>

          {/* Category */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.category}
              className={commonStyles.formGroup}
            >
              <Form.Label>Category</Form.Label>
              <Form.Select
                size="lg"
                required
                autoComplete="off"
                id={INPUT_ID.category}
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                isValid={getIsValid(ERROR_KEYS.category)}
                isInvalid={getIsInvalid(ERROR_KEYS.category)}
                disabled={!organization.is_draft}
              >
                <option></option>
                {PRODUCT_CATEGORY_LIST.filter(
                  (d) => d !== PRODUCT_CATEGORY_ALL_KEY
                ).map((categoryKey) => {
                  return (
                    <option key={categoryKey} value={categoryKey}>
                      {PRODUCT_CATEGORY_DETAILS[categoryKey].name}
                    </option>
                  );
                })}
              </Form.Select>
              {getErrorsFeedback(ERROR_KEYS.category)}
            </Form.Group>
          </Row>

          <Row>
            {/* Price */}
            <Form.Group
              as={Col}
              controlId={INPUT_ID.price}
              className={commonStyles.formGroup}
            >
              <Form.Label>Price</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <DollarSign />
                </InputGroup.Text>
                <Form.Control
                  size="lg"
                  type="number"
                  placeholder="0.00"
                  step=".01"
                  min="0"
                  required
                  autoComplete="off"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  isValid={getIsValid(ERROR_KEYS.price)}
                  isInvalid={getIsInvalid(ERROR_KEYS.price)}
                  readOnly={!organization.is_draft}
                />
                {getErrorsFeedback(ERROR_KEYS.price)}
              </InputGroup>
            </Form.Group>

            {/* Requested Amount */}
            <Form.Group
              md={4}
              as={Col}
              controlId={INPUT_ID.requestedAmount}
              className={commonStyles.formGroup}
            >
              <Form.Label>Requested Amount</Form.Label>
              <Form.Control
                size="lg"
                type="number"
                min="1"
                step="1"
                required
                autoComplete="off"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.requestedAmount)}
                isInvalid={getIsInvalid(ERROR_KEYS.requestedAmount)}
              />
              {getErrorsFeedback(ERROR_KEYS.requestedAmount)}
            </Form.Group>
          </Row>

          {/* Photo */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.photo}
              className={commonStyles.formGroup}
            >
              <Form.Label>Photo</Form.Label>
              <ImageUploadInput
                value={photo}
                onChange={(image) => setPhoto(image)}
                isInvalid={getIsInvalid(ERROR_KEYS.photo)}
                readOnly={!organization.is_draft}
                helpText="Illustration of the product you are looking for."
              />
              {getErrorsFeedback(ERROR_KEYS.photo)}
            </Form.Group>
          </Row>

          {/* High Demand */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.topPriority}
              className={commonStyles.formGroup}
            >
              <Form.Check
                type="checkbox"
                checked={topPriority}
                label="High demand"
                onChange={(e) => setTopPriority(e.target.checked)}
                isValid={getIsValid(ERROR_KEYS.topPriority)}
                isInvalid={getIsInvalid(ERROR_KEYS.topPriority)}
                aria-describedby="topPriorityHelpBlock"
                disabled={!organization.is_draft}
              />
              <Form.Text as="div" id="topPriorityHelpBlock">
                If checked, the product will have a &quot;High demand&quot;
                badge
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.topPriority)}
            </Form.Group>
          </Row>

          {/* Public */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.isPublic}
              className={commonStyles.formGroup}
            >
              <Form.Check
                type="checkbox"
                checked={isPublic}
                label="Public"
                onChange={(e) => setIsPublic(e.target.checked)}
                isValid={getIsValid(ERROR_KEYS.isPublic)}
                isInvalid={getIsInvalid(ERROR_KEYS.isPublic)}
                aria-describedby="publicHelpBlock"
                disabled={!organization.is_draft}
              />
              <Form.Text as="div" id="topPriorityHelpBlock">
                If checked, the product will show up on the main
                nonprofit&apos;s page. Useful, if you want the product to show
                up on the campaign page only.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.topPriority)}
            </Form.Group>
          </Row>

          {/* Description */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.description}
              className={commonStyles.formGroup}
            >
              <Form.Label>Minimal Requirements</Form.Label>
              <HtmlEditor
                value={description}
                onChange={(newValue) => setDescription(newValue)}
                readOnly={!organization.is_draft}
              />
              <Form.Text as="div">
                Describe what you are looking for, so donors could send you
                exactly what you need.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.description)}
            </Form.Group>
          </Row>

          {/* Position */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.position}
              className={commonStyles.formGroup}
            >
              <Form.Label>Order Position</Form.Label>
              <Form.Control
                size="lg"
                type="number"
                step="1"
                required
                autoComplete="off"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.position)}
                isInvalid={getIsInvalid(ERROR_KEYS.position)}
              />
              <Form.Text as="div">
                Change the order of goods on your page. The higher the value -
                the higher the position on the list. <br />
                Note: &quot;High Demand&quot; items appear first.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.position)}
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
