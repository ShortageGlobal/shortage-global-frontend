import styles from './products.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import { SectionHeader } from 'components/section-header/section-header';
import { CategorySelector } from 'components/products/category-selector/category-selector';
import { ProductCard } from 'components/products/product-card/product-card';
import { NEEDED_SUPPLIES_CONTAINER_ID } from 'app/constants';
import type { ProductPreview, Category } from 'app/api/types';

type ProductsProps = {
  products: ProductPreview[];
  isLoading: boolean;
  categories: Category[];
  currentCategory?: Category;
  onCategoryChange: (category: Category) => void;
};

export function Products({
  products,
  isLoading,
  categories,
  currentCategory,
  onCategoryChange,
}: ProductsProps) {
  return (
    <div className={styles.products}>
      {/* Header and Category Selector */}
      <Container>
        <Row>
          <Col>
            <div>
              <SectionHeader id={NEEDED_SUPPLIES_CONTAINER_ID}>
                Needed supplies {isLoading ? 'LOADING' : ''}
              </SectionHeader>

              <CategorySelector
                categories={categories}
                currentCategory={currentCategory}
                onCategoryChange={onCategoryChange}
              />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Products List */}
      <Container>
        <Row xl={5} lg={4} md={3} sm={2}>
          {products?.map((product) => {
            // only promoted products have "organization_slug" and "organization_name" property
            const organizationSlug = product.organization_slug || null;
            const organizationName = product.organization_name || null;
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
      </Container>
    </div>
  );
}
