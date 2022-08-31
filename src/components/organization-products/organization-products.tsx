import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  useAppDispatch,
  useAppSelector,
  useCancelToken,
  useDidMountEffect,
} from 'app/hooks';
import { selectOrganization } from 'app/store/slices/organization';
import {
  setCurrentCategory,
  selectCategories,
} from 'app/store/slices/categories';
import { selectSearch } from 'app/store/slices/search';
import {
  fetchProducts,
  selectProducts,
  setIsLoading,
} from 'app/store/slices/products';
import { PRODUCTS_PAGE_SIZE } from 'app/constants';
import { Products } from 'components/products/products';
import type { Category } from 'app/api/types';

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
