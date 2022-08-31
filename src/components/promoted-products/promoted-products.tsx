import { useCallback } from 'react';
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
import { selectSearch } from 'app/store/slices/search';
import {
  fetchPromotedProducts,
  selectPromotedProducts,
  setIsLoading,
} from 'app/store/slices/promoted-products';
import { Products } from 'components/products/products';
import type { Category } from 'app/api/types';

export function PromotedProducts() {
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
    250
  );

  // fetch products client-side
  useDidMountEffect(() => {
    dispatch(setIsLoading(true));
    debouncedFetchProducts({ category: currentCategory, search: searchQuery });
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [currentCategory, searchQuery]);

  // user selected another product category
  const handleCategoryChange = useCallback((category: Category) => {
    dispatch(setCurrentCategory(category));
  }, []);

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
