import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDebouncedCallback } from 'use-debounce';
import {
  useAppDispatch,
  useAppSelector,
  useCancelToken,
  useDidMountEffect,
} from 'app/hooks';
import {
  setCurrentCategory,
  selectPromotedCategories,
} from 'app/store/slices/promoted-categories';
import { selectSearch, setSearchQuery } from 'app/store/slices/search';
import {
  fetchPromotedProducts,
  selectPromotedProducts,
  setIsLoading,
} from 'app/store/slices/promoted-products';
import { Products } from 'components/products/products';
import type { Category } from 'app/api/types';
import { PRODUCT_CATEGORY_DETAILS } from 'app/constants';

export function PromotedProducts() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { categories, currentCategory } = useAppSelector(
    selectPromotedCategories
  );
  const { searchQuery } = useAppSelector(selectSearch);
  const { products, isLoading } = useAppSelector(selectPromotedProducts);
  const getFetchProductsCancelToken = useCancelToken();

  const debouncedFetchProducts = useDebouncedCallback(
    ({ category, search }: { category: Category; search: string }) => {
      // fetch products
      const cancelToken = getFetchProductsCancelToken();
      dispatch(fetchPromotedProducts({ category, search, cancelToken }));
    },
    500
  );

  useDidMountEffect(() => {
    dispatch(setIsLoading(true));
    debouncedFetchProducts({ category: currentCategory, search: searchQuery });
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [currentCategory, searchQuery]);

  // user selected another product category
  const handleCategoryChange = useCallback(
    (category: Category) => {
      const categoryDetails = PRODUCT_CATEGORY_DETAILS[category];

      // change "category" query parameter and clear "search"
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            category: categoryDetails.queryFilter,
            search: '',
          },
        },
        undefined,
        { shallow: true } // do not run getServerSideProps
      );

      dispatch(setCurrentCategory(category));
      dispatch(setSearchQuery(''));
    },
    [currentCategory, router]
  );

  return (
    <Products
      products={products}
      isLoading={isLoading}
      categories={categories}
      currentCategory={currentCategory}
      onCategoryChange={handleCategoryChange}
    />
  );
}
