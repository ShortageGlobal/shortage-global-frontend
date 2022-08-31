import styles from './products.module.scss';
import { useCallback } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import classNames from 'classnames';
import { useAppDispatch } from 'app/hooks';
import { setSearchQuery } from 'app/store/slices/search';
import { SectionHeader } from 'components/section-header/section-header';
import { CategorySelector } from 'components/products/category-selector/category-selector';
import { ProductCard } from 'components/products/product-card/product-card';
import { NEEDED_SUPPLIES_CONTAINER_ID } from 'app/constants';
import type { Slug, ProductPreview, Category } from 'app/api/types';

type ProductsProps = {
  products: ProductPreview[];
  count: number;
  isLoading: boolean;
  categories: Category[];
  currentCategory?: Category;
  getOrganizationSlug: (product: ProductPreview) => Slug;
  onCategoryChange: (category: Category) => void;
  onShowMore: () => void;
};

export function Products({
  products,
  count,
  isLoading,
  categories,
  currentCategory,
  getOrganizationSlug,
  onCategoryChange,
  onShowMore,
}: ProductsProps) {
  const dispatch = useAppDispatch();

  // clear search value
  const handleSearchClear = useCallback(() => {
    dispatch(setSearchQuery(''));
  }, []);

  return (
    <div className={styles.products}>
      {/* Header and Category Selector */}
      <Container>
        <Row>
          <Col>
            <div>
              <SectionHeader id={NEEDED_SUPPLIES_CONTAINER_ID}>
                Needed supplies
              </SectionHeader>

              {categories?.length > 1 ? (
                <CategorySelector
                  categories={categories}
                  currentCategory={currentCategory}
                  onCategoryChange={onCategoryChange}
                />
              ) : null}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Products List */}
      {products?.length > 0 ? (
        <Container>
          <Row
            xl={5}
            lg={4}
            md={3}
            sm={2}
            className={classNames(styles.productsContainer, {
              [styles.productsContainerLoading]: isLoading,
            })}
          >
            {products?.map((product) => {
              // only promoted products have "organization_slug" and "organization_name" property
              const organizationSlug = getOrganizationSlug(product);
              const organizationName = product.organization?.name || null;
              const key = `${organizationSlug}-${product.slug}`;
              return (
                <Col key={key}>
                  <ProductCard
                    product={product}
                    organizationSlug={organizationSlug}
                    organizationName={organizationName}
                  />
                </Col>
              );
            })}
          </Row>

          {products.length < count ? (
            <Row>
              <Col className={styles.showMoreContainer}>
                <Button
                  size="lg"
                  variant="outline-dark"
                  disabled={isLoading}
                  onClick={onShowMore}
                >
                  Show more
                </Button>
              </Col>
            </Row>
          ) : null}
        </Container>
      ) : null}

      {/* No products match the given query */}
      {!products?.length ? (
        <Container>
          <Row>
            <Col>
              <div className={styles.noProductsMessage}>
                <p>No products match the given query</p>
                <Button
                  variant="outline-dark"
                  disabled={isLoading}
                  onClick={handleSearchClear}
                >
                  Clear search
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      ) : null}
    </div>
  );
}
