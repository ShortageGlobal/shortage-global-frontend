import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  useAppDispatch,
  useAppSelector,
  useCancelToken,
  useDidMountEffect,
} from 'core/hooks';
import { selectOrganization } from 'core/store/slices/organization';
import {
  setCurrentCategory,
  selectCategories,
} from 'core/store/slices/categories';
import { selectSearch } from 'core/store/slices/search';
import {
  fetchProducts,
  selectProducts,
  setIsLoading,
} from 'core/store/slices/products';
import { PRODUCTS_PAGE_SIZE } from 'core/constants';
import { Products } from 'components/products/products';
import type { Category } from 'core/api/types';

export function OrganizationProducts() {
  const dispatch = useAppDispatch();
  const { organization } = useAppSelector(selectOrganization);
  const { categories, currentCategory } = useAppSelector(selectCategories);
  const { searchQuery } = useAppSelector(selectSearch);
  const { products, count, isLoading } = useAppSelector(selectProducts);
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
        fetchProducts({
          organizationSlug: organization.slug,
          category,
          search,
          offset,
          limit,
          cancelToken,
        })
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
      getOrganizationSlug={() => organization.slug}
      onCategoryChange={handleCategoryChange}
      onShowMore={handleShowMore}
    />
  );
}
