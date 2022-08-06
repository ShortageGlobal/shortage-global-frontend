import { useCallback } from 'react';
import { wrapper } from 'app/store';
import { useAppSelector } from 'app/hooks';
import { fetchPromotedOrganizations } from 'app/store/slices/promoted-organizations';
import {
  fetchPromotedCategories,
  setCurrentCategory,
  selectPromotedCategories,
} from 'app/store/slices/promoted-categories';
import {
  fetchPromotedProducts,
  selectPromotedProducts,
} from 'app/store/slices/promoted-products';
import { LandingBanner } from 'components/landing-banner/landing-banner';
import { PromotedOrganizations } from 'components/promoted-organizations/promoted-organizations';
import { Products } from 'components/products/products';
import type { NextPageWithLayout } from 'pages/_app';
import type { Category } from 'app/api/types';

const IndexPage: NextPageWithLayout = () => {
  const { categories, currentCategory } = useAppSelector(
    selectPromotedCategories
  );
  const { products } = useAppSelector(selectPromotedProducts);

  return (
    <>
      <LandingBanner />
      <PromotedOrganizations />
      <Products
        products={products}
        categories={categories}
        currentCategory={currentCategory}
      />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    // fetch organizations and categories
    await Promise.all([
      store.dispatch(fetchPromotedOrganizations()),
      store.dispatch(fetchPromotedCategories()),
    ]);

    // try to extract category from query parameters
    const { categories } = store.getState().promotedCategories;
    const categoryQueryParameter = context.query.category as Category;
    const currentCategory = categories.includes(categoryQueryParameter)
      ? categoryQueryParameter
      : null;
    store.dispatch(setCurrentCategory(currentCategory));

    // fetch products
    await store.dispatch(fetchPromotedProducts({ category: currentCategory }));

    return {
      props: {},
    };
  }
);

export default IndexPage;
