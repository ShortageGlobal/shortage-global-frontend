import commonStyles from 'styles/pages/private/common.module.scss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import classNames from 'classnames';
import { Eye, Edit, Settings, Trash2, Send } from 'react-feather';
import Joyride from 'react-joyride';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { manageNonprofitLayout } from 'core/layouts';
import { wrapper } from 'core/store';
import { useAppSelector } from 'core/hooks';
import { extractAccessTokenFromSession } from 'core/helpers';
import {
  fetchAccountOrganization,
  selectAccountOrganization,
} from 'core/store/slices/account-organization';
import { BreadcrumbsPortal } from 'core/layouts/breadcrumbs-portal/breadcrumbs-portal';
import {
  Breadcrumbs,
  getHomeCrumb,
  getManageNonprofitCrumb,
  getManageNonprofitRootCrumb,
  getManageNonprofitPageCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { NonprofitPageForm } from 'components/manage-nonprofit/page/nonprofit-page-form/nonprofit-page-form';
import { NonprofitConfirmUnpublishModal } from 'components/manage-nonprofit/page/nonprofit-confirm-unpublish-modal/nonprofit-confirm-unpublish-modal';
import { NonprofitConfirmDeleteModal } from 'components/manage-nonprofit/page/nonprofit-confirm-delete-modal/nonprofit-confirm-delete-modal';
import { MANAGE_NONPROFIT_TOUR_ID } from 'core/constants';
import type { Props as JoyrideProps } from 'react-joyride';
import type { NextPageWithLayout } from 'pages/_app';

const steps: JoyrideProps['steps'] = [
  {
    target: 'body',
    content: (
      <div>
        This quick guide will make you familiar with the admin panel and the
        next steps.
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: `#${MANAGE_NONPROFIT_TOUR_ID.NAV_PANEL}`,
    content: (
      <div>
        This is the navigation sidebar. It allows you to easily access different
        sections of your page.
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: `#${MANAGE_NONPROFIT_TOUR_ID.NONPROFIT_PAGE_NAV}`,
    content: (
      <div>
        Provide general information and customize the appearance of your page
        here.
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: `#${MANAGE_NONPROFIT_TOUR_ID.REQUESTED_GOODS_NAV}`,
    content: (
      <div>
        Create the list of requested goods. This will help donors know exactly
        what to donate and ensure that you receive the items you really need.
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: `#${MANAGE_NONPROFIT_TOUR_ID.DELIVERY_INSTRUCTIONS_NAV}`,
    content: (
      <div>
        To ensure that donors know where to send their in-kind donations, it is
        essential to provide the address of the facility where you are ready to
        accept packages.
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: `#${MANAGE_NONPROFIT_TOUR_ID.TAX_INFORMATION_NAV}`,
    content: (
      <div>
        To generate tax deduction receipts automatically, it is important to
        fill in your tax information.
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: `#${MANAGE_NONPROFIT_TOUR_ID.DONATIONS_NAV}`,
    content: (
      <div>
        Here you can easily track and manage all the donations received through
        Shortage. This includes viewing donor information, changing delivery
        statuses, managing tax receipts, and attaching impact stories.
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: `#${MANAGE_NONPROFIT_TOUR_ID.IMPACT_STORIES_NAV}`,
    content: (
      <div>
        Impact Stories is a way to say thank you to your donors and encourage
        more people to support your organization.
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: `#${MANAGE_NONPROFIT_TOUR_ID.PREVIEW_BUTTON}`,
    content: (
      <div>
        Use this button to preview your Shortage page before publishing it. This
        allows you to see how your page will look to potential donors and make
        any necessary changes before publishing.
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: `#${MANAGE_NONPROFIT_TOUR_ID.PUBLISH_BUTTON}`,
    content: (
      <div>
        Finally, when you are ready to publish your page, you can use the
        <Send size="1rem" className="mx-1" />
        Publish button. After publishing, your page will go through a
        verification process to ensure that it meets our guidelines. Once
        approved, your campaign will be live and ready to receive donations.
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },
];

const joyrideStyles = {
  options: {
    primaryColor: '#00b657',
    zIndex: 1031, // greater than header nav
  },
  tooltip: {
    borderRadius: 0,
    padding: '1rem',
  },
  tooltipTitle: {
    margin: '1rem 0.5rem',
  },
  buttonNext: {
    borderRadius: 0,
    lineHeight: 1.5,
    padding: '0.375rem 0.75rem',
    fontSize: '1rem',
  },
  buttonSkip: {
    lineHeight: 1.5,
    padding: '0.375rem 0.75rem',
    fontSize: '1rem',
  },
  buttonBack: {
    lineHeight: 1.5,
    padding: '0.375rem 0.75rem',
    marginRight: '0.5rem',
    fontSize: '1rem',
  },
  buttonClose: {
    // display: 'none',
  },
};

const NonprofitPagePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { organization } = useAppSelector(selectAccountOrganization);

  const [showBackToDraftModal, setShowBackToDraftModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [runTour, setRunTour] = useState(false);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getManageNonprofitCrumb(),
      getManageNonprofitRootCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getManageNonprofitPageCrumb({
        isActive: true,
        organizationSlug: organization.slug,
      }),
    ];
  }, [organization]);

  // start tour if needed
  useEffect(() => {
    if (router.query?.showTour) {
      setRunTour(true);
    }
  }, [router.query]);

  const joyrideCallback = useCallback(
    ({ action }) => {
      if (action === 'start') {
        document.body.classList.add('disable-scroll');
      }
      if (action === 'reset') {
        document.body.classList.remove('disable-scroll');

        // remove "showTour" from query params
        const queryParams = { ...router.query };
        delete queryParams.showTour;

        router.replace(
          { query: queryParams },
          undefined,
          { shallow: true } // do not run getServerSideProps
        );
        setRunTour(false);
      }
    },
    [router]
  );

  return (
    <>
      <Head>
        <title>{`${organization.name} — Nonprofit Page | Shortage`}</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <Joyride
        run={runTour}
        steps={steps}
        styles={joyrideStyles}
        callback={joyrideCallback}
        continuous
        showProgress
        showSkipButton
        disableScrolling
        disableOverlayClose
      />

      <div className={commonStyles.restrictedWidth}>
        <Row className={commonStyles.headerRow}>
          <Col>
            <h2 className={commonStyles.title}>
              <span>Nonprofit Page</span>

              <Dropdown>
                <Dropdown.Toggle variant="outline">
                  <Settings />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Link
                    href={{
                      pathname: '/[organizationSlug]/',
                      query: {
                        organizationSlug: organization.slug,
                      },
                    }}
                    passHref
                    legacyBehavior
                  >
                    <Dropdown.Item className={commonStyles.dropdownItem}>
                      <Eye size="1rem" />
                      <span>Preview</span>
                    </Dropdown.Item>
                  </Link>

                  {!organization.is_draft ? (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        as="button"
                        className={classNames(commonStyles.dropdownItem)}
                        onClick={() => setShowBackToDraftModal(true)}
                      >
                        <Edit size="1rem" />
                        <span>Back to draft</span>
                      </Dropdown.Item>
                    </>
                  ) : null}

                  <Dropdown.Divider />

                  <Dropdown.Item
                    as="button"
                    className={classNames(
                      commonStyles.dropdownItem,
                      commonStyles.dropdownItemDanger
                    )}
                    onClick={() => setShowDeleteConfirmationModal(true)}
                  >
                    <Trash2 size="1rem" />
                    <span>Delete page</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <NonprofitConfirmUnpublishModal
                organization={organization}
                show={showBackToDraftModal}
                onHide={() => setShowBackToDraftModal(false)}
              />

              <NonprofitConfirmDeleteModal
                organization={organization}
                show={showDeleteConfirmationModal}
                onHide={() => setShowDeleteConfirmationModal(false)}
              />
            </h2>
          </Col>
        </Row>
      </div>

      <NonprofitPageForm />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });
    const organizationSlug = context.params.organizationSlug as string;

    await store.dispatch(
      fetchAccountOrganization({ organizationSlug, accessToken })
    );

    const { accountOrganization } = store.getState();

    if (accountOrganization.error?.status === 404) {
      return {
        redirect: {
          destination: '/private/manage-nonprofit/',
          permanent: false,
        },
      };
    }

    if (accountOrganization.error?.status === 401) {
      const callbackUrl = encodeURIComponent(context.resolvedUrl);
      return {
        redirect: {
          destination: `/account/sign-in/?callbackUrl=${callbackUrl}`,
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  }
);

NonprofitPagePage.getLayout = manageNonprofitLayout;

export default NonprofitPagePage;
