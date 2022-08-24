import styles from 'styles/pages/organization.module.scss';
import { useMemo } from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';
import { wrapper } from 'app/store';
import {
  fetchOrganization,
  selectOrganization,
} from 'app/store/slices/organization';
// import { fetchCategories, selectCategories } from 'app/store/slices/categories';
// import { fetchProducts, selectProducts } from 'app/store/slices/products';
import {
  Breadcrumbs,
  getHomeCrumb,
  getOrganizationCrumb,
} from 'components/breadcrumbs/breadcrumbs';
import type { NextPageWithLayout } from 'pages/_app';
import { useAppSelector } from 'app/hooks';

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
        <title>{organization.name} | ShortageGlobal</title>
      </Head>

      <Container className={styles.organization}>
        <Row>
          <Col>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const organizationSlug = context.params.organizationSlug as string;

    await Promise.all([
      store.dispatch(fetchOrganization({ organizationSlug })),
      // store.dispatch(fetchCategories()),
      // store.dispatch(fetchProducts()),
    ]);

    const { organization } = store.getState();

    if (organization.error?.status === 404) {
      return {
        notFound: true,
      };
    }

    return {
      props: {},
    };
  }
);

export default OrganizationPage;
