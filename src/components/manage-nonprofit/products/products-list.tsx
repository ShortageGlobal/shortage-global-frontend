import styles from './products-list.module.scss';
import { useEffect, useState } from 'react';
import { Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import classNames from 'classnames';
import {
  useAppSelector,
  useNotifications,
  useCancelToken,
  isRequestCancel,
} from 'core/hooks';
import { selectAccountOrganization } from 'core/store/slices/account-organization';
import { useDebouncedCallback } from 'use-debounce';
import { fetchAccountOrganizationProducts } from 'core/api';
import { Pagination } from 'components/pagination/pagination';
import { LoadingMessage } from 'components/loading-message/loading-message';
import { ProductCard } from 'components/manage-nonprofit/products/product-card/product-card';
import { PRODUCT_CATEGORY_ALL_KEY, DEFAULT_PAGE_SIZE } from 'core/constants';
import type {
  Category,
  AccountOrganization,
  AccountProduct,
} from 'core/api/types';
import { Search } from 'react-feather';

export function ProductsList() {
  const { showNotification } = useNotifications();
  const { organization } = useAppSelector(selectAccountOrganization);

  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalCount, setTotalCount] = useState(null);
  const [products, setProducts] = useState<AccountProduct[]>([]);
  const [currentCategory /*, setCurrentCategory */] = useState<Category>(
    PRODUCT_CATEGORY_ALL_KEY
  );
  const [searchQuery, setSearchQuery] = useState('');

  const getFetchProductsCancelToken = useCancelToken();

  const debouncedFetchProducts = useDebouncedCallback(
    async ({
      organizationSlug,
      category,
      search,
      offset,
      limit,
    }: {
      organizationSlug: AccountOrganization['slug'];
      category: Category;
      search: string;
      offset?: number;
      limit?: number;
    }) => {
      const cancelToken = getFetchProductsCancelToken();

      setIsLoading(true);

      try {
        const response = await fetchAccountOrganizationProducts({
          organizationSlug,
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
      category: currentCategory,
      search: searchQuery,
      offset: pageSize * pageNumber,
      limit: pageSize,
    });

    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [organization.slug, currentCategory, searchQuery, pageSize, pageNumber]);

  return (
    <div>
      <Row className={styles.controls}>
        <Col>
          <InputGroup>
            <InputGroup.Text as="label" htmlFor="search-input">
              <Search />
            </InputGroup.Text>
            <Form.Control
              id="search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col className={styles.paginationCol}>
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
          className={classNames(styles.productsList, {
            [styles.loading]: isLoading,
          })}
        >
          {products.map((product) => {
            return (
              <ProductCard
                key={product.slug}
                product={product}
                organization={organization}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
