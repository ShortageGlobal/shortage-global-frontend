import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  useAppDispatch,
  useAppSelector,
  useCancelToken,
  useDidMountEffect,
} from 'core/hooks';
import {
  setCurrentCategory,
  selectPromotedCategories,
} from 'core/store/slices/promoted-categories';
import { selectSearch } from 'core/store/slices/search';
import {
  fetchPromotedProducts,
  selectPromotedProducts,
  setIsLoading,
} from 'core/store/slices/promoted-products';
import { PRODUCTS_PAGE_SIZE } from 'core/constants';
import { Products } from 'components/products/products';
import type { Category } from 'core/api/types';

export function PromotedProducts() {
  const dispatch = useAppDispatch();
  const { categories, currentCategory } = useAppSelector(
    selectPromotedCategories
  );
  const { searchQuery } = useAppSelector(selectSearch);
  const { products, count, isLoading } = useAppSelector(selectPromotedProducts);
  const getFetchProductsCancelToken = useCancelToken();

  const debouncedFetchProducts = useDebouncedCallback(
    ({
      category,
      search,
      offset = 0,
      limit = PRODUCTS_PAGE_SIZE,
    }: {
      category: Category;
      search: string;
      offset?: number;
      limit?: number;
    }) => {
      // fetch products
      const cancelToken = getFetchProductsCancelToken();
      dispatch(
        fetchPromotedProducts({ category, search, offset, limit, cancelToken })
      );
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

  // user clicked "Show more"
  const handleShowMore = useCallback(() => {
    dispatch(setIsLoading(true));
    debouncedFetchProducts({
      category: currentCategory,
      search: searchQuery,
      offset: products.length,
      limit: PRODUCTS_PAGE_SIZE,
    });
  }, [currentCategory, searchQuery, products]);

  return (
    <Products
      products={products}
      count={count}
      isLoading={isLoading}
      categories={categories}
      currentCategory={currentCategory}
      getOrganizationSlug={(product) => product.organization.slug}
      onCategoryChange={handleCategoryChange}
      onShowMore={handleShowMore}
    />
  );
}
