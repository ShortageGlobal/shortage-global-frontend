import styles from './campaign-products-list.module.scss';
import commonStyles from 'styles/pages/private/common.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useCallback, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import classNames from 'classnames';
import { Check, X, Loader, Search } from 'react-feather';
import {
  useAppSelector,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import { selectAccountCampaign } from 'core/store/slices/account-campaign';
import { useDebouncedCallback } from 'use-debounce';
import {
  fetchAccountCampaignProducts,
  removeAccountProductFromCampaign,
  addAccountProductToCampaign,
} from 'core/api';
import { Pagination } from 'components/pagination/pagination';
import { LoadingMessage } from 'components/loading-message/loading-message';
import { ProductCard } from 'components/manage-nonprofit/products/product-card/product-card';
import { PRODUCT_CATEGORY_ALL_KEY, DEFAULT_PAGE_SIZE } from 'core/constants';
import type {
  Category,
  AccountOrganization,
  AccountCampaign,
  AccountCampaignProduct,
} from 'core/api/types';

export function CampaignProductsList() {
  const { showNotification } = useNotifications();
  const { organization } = useAppSelector(selectAccountOrganization);
  const { campaign } = useAppSelector(selectAccountCampaign);

  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalCount, setTotalCount] = useState(null);
  const [products, setProducts] = useState<AccountCampaignProduct[]>([]);
  const [currentCategory /*, setCurrentCategory */] = useState<Category>(
    PRODUCT_CATEGORY_ALL_KEY
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [productIdsSavingInclusion, setProductIdsSavingInclusion] = useState<
    Set<AccountCampaignProduct['id']>
  >(new Set());

  const getFetchProductsCancelToken = useCancelToken();
  const getChangeProductInclusionCancelToken = useCancelToken();

  const debouncedFetchProducts = useDebouncedCallback(
    async ({
      organizationSlug,
      campaignUuid,
      category,
      search,
      offset,
      limit,
    }: {
      organizationSlug: AccountOrganization['slug'];
      campaignUuid: AccountCampaign['uuid'];
      category: Category;
      search: string;
      offset?: number;
      limit?: number;
    }) => {
      const cancelToken = getFetchProductsCancelToken();

      setIsLoading(true);

      try {
        const response = await fetchAccountCampaignProducts({
          organizationSlug,
          campaignUuid,
          category,
          search,
          offset,
          limit,
          cancelToken,
        });

        setProducts(response.data.results);
        setTotalCount(response.data.count);
        setIsLoading(false);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        const rejectionErrors = rejection?.response?.data;
        showNotification({
          isFailure: true,
          message: rejectionErrors?.details || 'Failed to get products',
        });
        setIsLoading(false);
      }
    },
    250
  );

  useEffect(() => {
    debouncedFetchProducts({
      organizationSlug: organization.slug,
      campaignUuid: campaign.uuid,
      category: currentCategory,
      search: searchQuery,
      offset: pageSize * pageNumber,
      limit: pageSize,
    });

    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [
    organization.slug,
    campaign.uuid,
    currentCategory,
    searchQuery,
    pageSize,
    pageNumber,
  ]);

  const handleToggleProductInclusion = useCallback(
    async (product: AccountCampaignProduct) => {
      const cancelToken = getChangeProductInclusionCancelToken(
        `product-${product.id}`
      );

      let promise;
      if (product.is_included_in_campaign) {
        promise = removeAccountProductFromCampaign({
          organizationSlug: organization.slug,
          campaignUuid: campaign.uuid,
          productId: product.id,
          cancelToken,
        });
      } else {
        promise = addAccountProductToCampaign({
          organizationSlug: organization.slug,
          campaignUuid: campaign.uuid,
          productId: product.id,
          cancelToken,
        });
      }

      // change product saving state
      setProductIdsSavingInclusion((prev) => {
        const newSet = new Set(prev);
        newSet.add(product.id);
        return newSet;
      });

      try {
        await promise;
        // change product saving state
        setProductIdsSavingInclusion((prev) => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
        // change product status in the list
        setProducts((prev) => {
          const index = prev.findIndex((p) => p.id === product.id);
          if (index !== -1) {
            const newProduct = {
              ...prev[index],
              is_included_in_campaign: !prev[index].is_included_in_campaign,
            };
            const newProducts = [...prev];
            newProducts[index] = newProduct;
            return newProducts;
          }
          return prev;
        });
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        const rejectionErrors = rejection?.response?.data;
        const errorMessage = product.is_included_in_campaign
          ? 'Failed to remove product from campaign'
          : 'Failed to add product to campaign';
        showNotification({
          isFailure: true,
          message: rejectionErrors?.details || errorMessage,
        });

        // change product saving state
        setProductIdsSavingInclusion((prev) => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
      }
    },
    [organization.slug, campaign.uuid]
  );

  return (
    <div>
      <Row className={commonStyles.listControls}>
        <Col>
          <InputGroup>
            <InputGroup.Text as="label" htmlFor="search-input">
              <Search />
            </InputGroup.Text>
            <Form.Control
              id="search-input"
              className={commonStyles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col className={commonStyles.paginationCol}>
          {products?.length > 0 ? (
            <Pagination
              pageSize={pageSize}
              pageNumber={pageNumber}
              totalCount={totalCount}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              onPageNumberChange={(newPageNumber) =>
                setPageNumber(newPageNumber)
              }
            />
          ) : null}
        </Col>
      </Row>

      {/* Loading */}
      {!products?.length && isLoading ? <LoadingMessage /> : null}

      {/* No products */}
      {products?.length === 0 && !isLoading ? (
        <div>
          <p>No products found.</p>
          {searchQuery?.length > 0 ? (
            <Button variant="outline-dark" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          ) : null}
        </div>
      ) : null}

      {/* Products list */}
      {products?.length > 0 ? (
        <div
          className={classNames(commonStyles.list, {
            [commonStyles.loading]: isLoading,
          })}
        >
          {products.map((product) => {
            const isSavingInclusion = productIdsSavingInclusion.has(product.id);
            return (
              <div key={product.slug} className={styles.productRow}>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      {product.is_included_in_campaign
                        ? 'Remove from campaign'
                        : 'Add to campaign'}
                    </Tooltip>
                  }
                >
                  <Button
                    className={classNames(styles.controlBtn, {
                      [styles.isProductIncluded]:
                        product.is_included_in_campaign,
                      [styles.isSaving]: isSavingInclusion,
                    })}
                    variant="outline-dark"
                    disabled={isSavingInclusion}
                    onClick={() => handleToggleProductInclusion(product)}
                  >
                    <Check className={styles.checkGlyph} />
                    <X className={styles.xGlyph} />

                    {isSavingInclusion ? (
                      <Loader
                        role="status"
                        aria-hidden="true"
                        className={animationStyles.rotate}
                      />
                    ) : null}
                  </Button>
                </OverlayTrigger>

                <ProductCard
                  className={styles.productCard}
                  id={product.id}
                  name={product.name}
                  category={product.category}
                  photo={product.photo}
                  price={product.price}
                  requestedAmount={product.requested_amount}
                  isPublic={product.is_public}
                  topPriority={product.top_priority}
                  organization={organization}
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
