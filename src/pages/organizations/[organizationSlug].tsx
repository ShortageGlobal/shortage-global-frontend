import { wrapper } from 'app/store';
import {
  fetchPromotedOrganizations,
  selectPromotedOrganizations,
} from 'app/store/slices/promoted-organizations';
import {
  fetchPromotedCategories,
  selectPromotedCategories,
} from 'app/store/slices/promoted-categories';
import {
  fetchPromotedProducts,
  selectPromotedProducts,
} from 'app/store/slices/promoted-products';
import type { NextPageWithLayout } from 'pages/_app';
import { useAppSelector } from 'app/hooks';
import { LandingBanner } from 'components/landing-banner/landing-banner';

const OrganizationPage: NextPageWithLayout = () => {
  const { organizations } = useAppSelector(selectPromotedOrganizations);
  const { categories } = useAppSelector(selectPromotedCategories);
  const { products } = useAppSelector(selectPromotedProducts);

  return <div>organization page</div>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await Promise.all([
      store.dispatch(fetchPromotedOrganizations()),
      store.dispatch(fetchPromotedCategories()),
      store.dispatch(fetchPromotedProducts()),
    ]);
    return {
      props: {},
    };
  }
);

export default OrganizationPage;
