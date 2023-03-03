import commonStyles from 'styles/pages/private/common.module.scss';
import { useMemo, useState } from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import classNames from 'classnames';
import { Eye, Settings, Trash2 } from 'react-feather';
import Head from 'next/head';
import Link from 'next/link';
import { manageNonprofitLayout } from 'core/layouts';
import { wrapper } from 'core/store';
import { useAppSelector } from 'core/hooks';
import { extractAccessTokenFromSession } from 'core/helpers';
import {
  fetchAccountOrganization,
  selectAccountOrganization,
} from 'core/store/slices/account-organization';
import {
  fetchAccountOrganizationProduct,
  selectAccountProduct,
} from 'core/store/slices/account-product';
import { BreadcrumbsPortal } from 'core/layouts/breadcrumbs-portal/breadcrumbs-portal';
import {
  Breadcrumbs,
  getHomeCrumb,
  getManageNonprofitCrumb,
  getManageNonprofitRootCrumb,
  getManageRequestedGoodsCrumb,
  getManageRequestedGoodsEditCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { ProductForm } from 'components/manage-nonprofit/products/product-form/product-form';
import { ProductConfirmDeleteModal } from 'components/manage-nonprofit/products/product-confirm-delete-modal/product-confirm-delete-modal';
import type { NextPageWithLayout } from 'pages/_app';

const RequestedGoodsPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectAccountOrganization);
  const { product } = useAppSelector(selectAccountProduct);

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
      getManageRequestedGoodsCrumb({
        organizationSlug: organization.slug,
      }),
      getManageRequestedGoodsEditCrumb({
        isActive: true,
        organizationSlug: organization.slug,
        productId: product.id,
      }),
    ];
  }, [organization, product]);

  return (
    <>
      <Head>
        <title>{`${organization.name} — Edit Request | Shortage`}</title>
      </Head>

      <BreadcrumbsPortal>
        <Breadcrumbs items={breadcrumbs} />
      </BreadcrumbsPortal>

      <div className={commonStyles.restrictedWidth}>
        <Row className={commonStyles.headerRow}>
          <Col>
            <h2 className={commonStyles.title}>
              <span>Edit Request</span>

              <Dropdown>
                <Dropdown.Toggle variant="outline">
                  <Settings />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Link
                    href={{
                      pathname: '/[organizationSlug]/products/[productSlug]/',
                      query: {
                        organizationSlug: organization.slug,
                        productSlug: product.slug,
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

      <ProductForm product={product} />

      <ProductConfirmDeleteModal
        organization={organization}
        product={product}
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
    const productId = context.params.productId as string;

    await Promise.all([
      store.dispatch(
        fetchAccountOrganization({ organizationSlug, accessToken })
      ),
      store.dispatch(
        fetchAccountOrganizationProduct({
          organizationSlug,
          productId,
          accessToken,
        })
      ),
    ]);

    const { accountOrganization, accountProduct } = store.getState();

    if (
      accountOrganization.error?.status === 404 ||
      accountProduct.error?.status === 404
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
      accountProduct.error?.status === 401
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

RequestedGoodsPage.getLayout = manageNonprofitLayout;

export default RequestedGoodsPage;
