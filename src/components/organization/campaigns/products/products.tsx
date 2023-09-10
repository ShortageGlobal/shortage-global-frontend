import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  useAppDispatch,
  useAppSelector,
  useCancelToken,
  useDidMountEffect,
} from 'core/hooks';
import { selectOrganization } from 'core/store/slices/organization';
import { selectCampaign } from 'core/store/slices/campaign';
import {
  setCurrentCampaignCategory,
  selectCampaignCategories,
} from 'core/store/slices/campaign-categories';
import { selectSearch } from 'core/store/slices/search';
import {
  fetchCampaignProducts,
  selectCampaignProducts,
  setIsLoading,
} from 'core/store/slices/campaign-products';
import { PRODUCTS_PAGE_SIZE } from 'core/constants';
import { Products } from 'components/products/products';
import type { Category } from 'core/api/types';

export function CampaignProducts() {
  const dispatch = useAppDispatch();
  const { organization } = useAppSelector(selectOrganization);
  const { campaign } = useAppSelector(selectCampaign);
  const { campaignCategories, currentCampaignCategory } = useAppSelector(
    selectCampaignCategories
  );
  const { searchQuery } = useAppSelector(selectSearch);
  const { campaignProducts, count, isLoading } = useAppSelector(
    selectCampaignProducts
  );
  const getFetchCampaignProductsCancelToken = useCancelToken();

  const debouncedFetchCampaignProducts = useDebouncedCallback(
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
      const cancelToken = getFetchCampaignProductsCancelToken();
      dispatch(
        fetchCampaignProducts({
          organizationSlug: organization.slug,
          campaignSlug: campaign.slug,
          campaignUuid: campaign.uuid,
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
    debouncedFetchCampaignProducts({
      category: currentCampaignCategory,
      search: searchQuery,
    });
    return () => {
      debouncedFetchCampaignProducts.cancel();
    };
  }, [currentCampaignCategory, searchQuery]);

  // user selected another product category
  const handleCategoryChange = useCallback((category: Category) => {
    dispatch(setCurrentCampaignCategory(category));
  }, []);

  // user clicked "Show more"
  const handleShowMore = useCallback(() => {
    dispatch(setIsLoading(true));
    debouncedFetchCampaignProducts({
      category: currentCampaignCategory,
      search: searchQuery,
      offset: campaignProducts.length,
      limit: PRODUCTS_PAGE_SIZE,
    });
  }, [currentCampaignCategory, searchQuery, campaignProducts]);

  return (
    <Products
      campaign={campaign}
      products={campaignProducts}
      count={count}
      isLoading={isLoading}
      categories={campaignCategories}
      currentCategory={currentCampaignCategory}
      getOrganizationSlug={() => organization.slug}
      onCategoryChange={handleCategoryChange}
      onShowMore={handleShowMore}
    />
  );
}
