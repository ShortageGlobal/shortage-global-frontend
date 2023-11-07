import commonStyles from 'styles/pages/private/common.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useEffect, useCallback, useState, useMemo } from 'react';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';
import { useRouter } from 'next/router';
import {
  useAppDispatch,
  useAppSelector,
  useNotifications,
  useCancelToken,
  isRequestCancel,
  useNavigationLock,
} from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import { patchCampaign } from 'core/store/slices/account-campaign';
import {
  createAccountOrganizationCampaign,
  updateAccountOrganizationCampaign,
} from 'core/api';
import { stripProtocolFromUrl, slugify, bothEmptyOrEqual } from 'core/helpers';
import { ImageUploadInput } from 'components/image-upload-input/image-upload-input';
import { FormControlExample } from 'components/form-control-example/form-control-example';
import { ROOT_URL } from 'core/constants';
import type { FormEvent } from 'react';
import type { ImageListType } from 'react-images-uploading';
import type { AccountCampaign } from 'core/api/types';

const INPUT_ID = Object.freeze({
  name: 'name',
  slug: 'slug',
  banner: 'banner',
  deadline: 'deadline',
  requestedGoods: 'requestedGoods',
  missionDescription: 'missionDescription',
  metaDescription: 'metaDescription',
  isDraft: 'isDraft',
  isPublic: 'isPublic',
});
const ERROR_KEYS = Object.freeze({
  [INPUT_ID.name]: 'name',
  [INPUT_ID.slug]: 'slug',
  [INPUT_ID.banner]: 'banner',
  [INPUT_ID.deadline]: 'deadline',
  [INPUT_ID.requestedGoods]: 'requested_goods',
  [INPUT_ID.missionDescription]: 'mission_description',
  [INPUT_ID.metaDescription]: 'meta_description',
  [INPUT_ID.isDraft]: 'is_draft',
  [INPUT_ID.isPublic]: 'is_public',
});
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];

type CampaignFormProps = {
  campaign?: AccountCampaign;
};

export function CampaignForm({ campaign }: CampaignFormProps = {}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showNotification } = useNotifications();

  const { organization } = useAppSelector(selectAccountOrganization);

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<ErrorKey, string[]>>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugPristine, setIsSlugPristine] = useState(false);
  const [banner, setBanner] = useState<ImageListType>([]);
  const [deadline, setDeadline] = useState('');
  const [requestedGoods, setRequestedGoods] = useState('');
  const [missionDescription, setMissionDescription] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isDraft, setIsDraft] = useState<boolean>(true);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const defaultValues = useMemo(() => {
    return Object.freeze({
      name: campaign?.name || '',
      slug: campaign?.slug || '',
      banner: campaign?.banner ? [{ dataURL: campaign.banner }] : [],
      deadline: campaign?.deadline
        ? new Date(campaign.deadline).toLocaleString('sv')
        : '',
      requestedGoods: campaign?.requested_goods || '',
      missionDescription: campaign?.mission_description || '',
      metaDescription: campaign?.meta_description || '',
      isDraft: campaign?.is_draft ?? true,
      isPublic: campaign?.is_public ?? true,
    });
  }, [campaign]);

  // store campaign in state
  useEffect(() => {
    setName(defaultValues.name);
    setSlug(defaultValues.slug);
    setIsSlugPristine(!defaultValues?.slug);
    setBanner(defaultValues.banner);
    setDeadline(defaultValues.deadline);
    setRequestedGoods(defaultValues.requestedGoods);
    setMissionDescription(defaultValues.missionDescription);
    setMetaDescription(defaultValues.metaDescription);
    setIsDraft(defaultValues.isDraft);
    setIsPublic(defaultValues.isPublic);
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
      bothEmptyOrEqual(defaultValues.banner[0]?.dataURL, banner[0]?.dataURL) &&
      bothEmptyOrEqual(
        defaultValues.deadline,
        deadline ? new Date(deadline).toLocaleString('sv') : ''
      ) &&
      bothEmptyOrEqual(defaultValues.requestedGoods, requestedGoods) &&
      bothEmptyOrEqual(defaultValues.missionDescription, missionDescription) &&
      bothEmptyOrEqual(defaultValues.metaDescription, metaDescription) &&
      bothEmptyOrEqual(defaultValues.isDraft, isDraft) &&
      bothEmptyOrEqual(defaultValues.isPublic, isPublic)
    ) {
      return false;
    }

    return true;
  }, [
    defaultValues,
    isSaving,
    name,
    slug,
    banner,
    deadline,
    requestedGoods,
    missionDescription,
    metaDescription,
    isDraft,
    isPublic,
  ]);

  useNavigationLock(isFormDirty);

  const getAccountCampaignCancelToken = useCancelToken();

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isSaving) {
        return;
      }

      setIsSaving(true);

      const cancelToken = getAccountCampaignCancelToken();

      try {
        if (!campaign) {
          const response = await createAccountOrganizationCampaign({
            organizationSlug: organization.slug,
            name,
            slug,
            banner: banner?.length ? banner[0]?.file || null : '',
            deadline: deadline ? new Date(deadline).toISOString() : '',
            requestedGoods,
            missionDescription,
            metaDescription,
            isDraft,
            isPublic,
            cancelToken,
          });

          // redirect to the campaign's requested goods page
          router.push({
            pathname:
              '/private/manage-nonprofit/[organizationSlug]/campaigns/[campaignId]/requested-goods/',
            query: {
              organizationSlug: organization.slug,
              campaignId: response.data.uuid,
            },
          });
        } else {
          const response = await await updateAccountOrganizationCampaign({
            organizationSlug: organization.slug,
            campaignUuid: campaign.uuid,
            name,
            slug,
            banner: banner?.length ? banner[0]?.file || null : '',
            deadline: deadline ? new Date(deadline).toISOString() : '',
            requestedGoods,
            missionDescription,
            metaDescription,
            isDraft,
            isPublic,
            cancelToken,
          });
          setIsSaving(false);

          // update organization in store
          dispatch(patchCampaign(response.data));
        }

        setErrors(null);
        showNotification({
          isSuccess: true,
          message: 'Campaign saved successfully',
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
          message: rejectionErrors?.details || 'Failed to save Campaign',
        });
      }
    },
    [
      organization,
      campaign,
      isSaving,
      name,
      slug,
      banner,
      deadline,
      requestedGoods,
      missionDescription,
      metaDescription,
      isDraft,
      isPublic,
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
                  {`${stripProtocolFromUrl(ROOT_URL)}/<...>/campaigns/`}
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
                helpText="A cover photo for the campaign. Optional."
              />
              {getErrorsFeedback(ERROR_KEYS.banner)}
            </Form.Group>
          </Row>

          {/* Deadline */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.deadline}
              className={commonStyles.formGroup}
            >
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                size="lg"
                type="datetime-local"
                autoComplete="off"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.deadline)}
                isInvalid={getIsInvalid(ERROR_KEYS.deadline)}
                aria-describedby="deadlineHelpBlock"
              />
              <Form.Text as="div" id="deadlineHelpBlock">
                {`The countdown to this time and date will be shown on the campaign's page. The time you see is local. Optional.`}
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.deadline)}
            </Form.Group>
          </Row>

          {/* Requested goods */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.requestedGoods}
              className={commonStyles.formGroup}
            >
              <Form.Label className="text-break">
                <span>Support {name} with</span>
                <FormControlExample
                  triggerClassname="ms-3"
                  example={`school supplies, diapers, toys, laptops`}
                />
              </Form.Label>
              <Form.Control
                size="lg"
                type="text"
                autoComplete="off"
                placeholder=""
                maxLength={200}
                value={requestedGoods}
                onChange={(e) => setRequestedGoods(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.requestedGoods)}
                isInvalid={getIsInvalid(ERROR_KEYS.requestedGoods)}
                aria-describedby="requestedGoodsHelpBlock"
              />
              <Form.Text as="div" id="requestedGoodsHelpBlock">
                Specify what better describes items you are looking for.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.requestedGoods)}
            </Form.Group>
          </Row>

          {/* Mission Description */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.missionDescription}
              className={commonStyles.formGroup}
            >
              <Form.Label className="text-break">
                <span>Mission</span>
                <FormControlExample
                  triggerClassname="ms-3"
                  example={`${organization.name} has partnered with Shortage to collect ... for ${name}`}
                  onApply={(example) => setMissionDescription(example)}
                />
              </Form.Label>
              <Form.Control
                as="textarea"
                size="lg"
                type="text"
                autoComplete="off"
                placeholder=""
                rows={5}
                maxLength={1000}
                value={missionDescription}
                onChange={(e) => setMissionDescription(e.target.value)}
                isValid={getIsValid(ERROR_KEYS.missionDescription)}
                isInvalid={getIsInvalid(ERROR_KEYS.missionDescription)}
                aria-describedby="missionDescriptionHelpBlock"
              />
              <Form.Text as="div" id="missionDescriptionHelpBlock">
                Short description of the campaign, who you help, and how donors
                can help.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.missionDescription)}
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
                  example={`Make an in-kind donation to ${name}.`}
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

          {/* Is public */}
          <Row>
            <Form.Group
              as={Col}
              controlId={INPUT_ID.isPublic}
              className={commonStyles.formGroup}
            >
              <Form.Check
                type="checkbox"
                checked={isPublic}
                label="Show on the nonprofit page"
                onChange={(e) => setIsPublic(e.target.checked)}
                isValid={getIsValid(ERROR_KEYS.isPublic)}
                isInvalid={getIsInvalid(ERROR_KEYS.isPublic)}
                aria-describedby="isPublicHelpBlock"
              />
              <Form.Text as="div" id="isPublicHelpBlock">
                If checked, the campaign page will appear on the main
                organization&apos;s page. If not, the campaign page is reachable
                by the direct link only.
              </Form.Text>
              {getErrorsFeedback(ERROR_KEYS.isPublic)}
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
                If checked, the campaign page will be able to be viewed by
                donors.
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
