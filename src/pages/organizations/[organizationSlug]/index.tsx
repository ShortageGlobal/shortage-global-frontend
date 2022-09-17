import styles from 'styles/pages/organization.module.scss';
import { useMemo } from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';
import { wrapper } from 'app/store';
import { useAppSelector } from 'app/hooks';
import {
  fetchOrganization,
  selectOrganization,
} from 'app/store/slices/organization';
import {
  fetchCategories,
  setCurrentCategory,
} from 'app/store/slices/categories';
import { fetchProducts } from 'app/store/slices/products';
import { setSearchQuery } from 'app/store/slices/search';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import { OrganizationHowItWorks } from 'components/organization/how-it-works/how-it-works';
import { OrganizationDetails } from 'components/organization/details/details';
import { OrganizationProducts } from 'components/organization/products/products';
import { PRODUCT_CATEGORY_ALL_KEY, PRODUCTS_PAGE_SIZE } from 'app/constants';
import type { Category } from 'app/api/types';
import type { NextPageWithLayout } from 'pages/_app';

const OrganizationPage: NextPageWithLayout = () => {
  const { organization } = useAppSelector(selectOrganization);

  const breadcrumbs = useMemo(() => {
    return [
      getHomeCrumb(),
      getOrganizationCrumb({
        organizationSlug: organization.slug,
        organizationName: organization.name,
        isActive: true,
      }),
    ];
  }, [organization]);

  return (
    <>
      <Head>
        <title>{organization.name} | Shortage</title>
      </Head>

      <Container className={styles.organization}>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>

      <OrganizationDetails />
      <OrganizationHowItWorks />
      <OrganizationProducts />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const organizationSlug = context.params.organizationSlug as string;

    await Promise.all([
      store.dispatch(fetchOrganization({ organizationSlug })),
      store.dispatch(fetchCategories({ organizationSlug })),
    ]);

    const { organization } = store.getState();

    if (organization.error?.status === 404) {
      return {
        notFound: true,
      };
    }

    // try to extract category from query parameters
    const { categories } = store.getState().categories;
    const categoryQuery = context.query.category as Category;
    const currentCategory = categories.includes(categoryQuery)
      ? categoryQuery
      : PRODUCT_CATEGORY_ALL_KEY;
    store.dispatch(setCurrentCategory(currentCategory));

    // try to extract search from query parameters
    let search = context.query.search;
    if (typeof search !== 'string') {
      search = '';
    }
    store.dispatch(setSearchQuery(search));

    // fetch products
    await store.dispatch(
      fetchProducts({
        organizationSlug,
        category: currentCategory,
        search,
        limit: PRODUCTS_PAGE_SIZE,
      })
    );

    return {
      props: {},
    };
  }
);

export default OrganizationPage;
