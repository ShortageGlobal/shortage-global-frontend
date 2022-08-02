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

const IndexPage: NextPageWithLayout = () => {
  const { organizations } = useAppSelector(selectPromotedOrganizations);
  const { categories } = useAppSelector(selectPromotedCategories);
  const { products } = useAppSelector(selectPromotedProducts);

  return (
    <div>
      organizations <br />
      {organizations?.map((org) => {
        return ' ' + org.name + ' ';
      })}
      <br />
      categories <br />
      {categories?.map((category) => {
        return ' ' + category + ' ';
      })}
      <br />
      products <br />
      {products?.map((product) => {
        return ' ' + product.name + ' ';
      })}
    </div>
  );
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

export default IndexPage;
