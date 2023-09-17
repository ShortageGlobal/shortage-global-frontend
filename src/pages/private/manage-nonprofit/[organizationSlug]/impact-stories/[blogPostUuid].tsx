import commonStyles from 'styles/pages/private/common.module.scss';
import { useMemo, useState } from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import { Eye, Settings, Trash2 } from 'react-feather';
import { manageNonprofitLayout } from 'core/layouts';
import { wrapper } from 'core/store';
import { useAppSelector } from 'core/hooks';
import { extractAccessTokenFromSession } from 'core/helpers';
import {
  fetchAccountOrganization,
  selectAccountOrganization,
} from 'core/store/slices/account-organization';
import {
  fetchAccountOrganizationBlogPost,
  selectAccountBlogPost,
} from 'core/store/slices/account-blog-post';
import { BreadcrumbsPortal } from 'core/layouts/breadcrumbs-portal/breadcrumbs-portal';
import {
  Breadcrumbs,
  getHomeCrumb,
  getManageNonprofitCrumb,
  getManageNonprofitRootCrumb,
  getManageImpactStoriesCrumb,
  getManageImpactStoriesEditCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { BlogPostForm } from 'components/manage-nonprofit/blog-posts/blog-post-form/blog-post-form';
import { BlogPostConfirmDeleteModal } from 'components/manage-nonprofit/blog-posts/blog-post-confirm-delete-modal/blog-post-confirm-delete-modal';
import type { NextPageWithLayout } from 'pages/_app';

const ImpactStoryEditPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectAccountOrganization);
  const { blogPost } = useAppSelector(selectAccountBlogPost);

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getManageNonprofitCrumb(),
      getManageNonprofitRootCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
      }),
      getManageImpactStoriesCrumb({
        organizationSlug: organization.slug,
      }),
      getManageImpactStoriesEditCrumb({
        isActive: true,
        organizationSlug: organization.slug,
        blogPostUuid: blogPost.uuid,
      }),
    ];
  }, [organization, blogPost]);

  return (
    <>
      <Head>
        <title>{`${organization.name} — Edit Impact Story | Shortage`}</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <div className={commonStyles.restrictedWidth}>
        <Row className={commonStyles.headerRow}>
          <Col>
            <h2 className={commonStyles.title}>
              <span>Edit Impact Story</span>

              <Dropdown>
                <Dropdown.Toggle variant="outline">
                  <Settings />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Link
                    href={{
                      pathname:
                        '/[organizationSlug]/impact-stories/[blogPostSlug]/',
                      query: {
                        organizationSlug: organization.slug,
                        blogPostSlug: blogPost.slug,
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
                    <span>Delete</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </h2>
          </Col>
        </Row>
      </div>

      <BlogPostForm blogPost={blogPost} />

      <BlogPostConfirmDeleteModal
        organization={organization}
        blogPost={blogPost}
        show={showDeleteConfirmationModal}
        onHide={() => setShowDeleteConfirmationModal(false)}
      />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const accessToken = await extractAccessTokenFromSession({
      req: context.req,
    });
    const organizationSlug = context.params.organizationSlug as string;
    const blogPostUuid = context.params.blogPostUuid as string;

    await Promise.all([
      store.dispatch(
        fetchAccountOrganization({ organizationSlug, accessToken })
      ),
      store.dispatch(
        fetchAccountOrganizationBlogPost({
          organizationSlug,
          blogPostUuid,
          accessToken,
        })
      ),
    ]);

    const { accountOrganization, accountBlogPost } = store.getState();

    if (
      accountOrganization.error?.status === 404 ||
      accountBlogPost.error?.status === 404
    ) {
      return {
        redirect: {
          destination: '/private/manage-nonprofit/',
          permanent: false,
        },
      };
    }

    if (
      accountOrganization.error?.status === 401 ||
      accountBlogPost.error?.status === 401
    ) {
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

ImpactStoryEditPage.getLayout = manageNonprofitLayout;

export default ImpactStoryEditPage;
