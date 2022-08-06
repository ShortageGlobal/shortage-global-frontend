import styles from './products.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import { SectionHeader } from 'components/section-header/section-header';
import { CategorySelector } from 'components/products/category-selector/category-selector';
import { NEEDED_SUPPLIES_CONTAINER_ID } from 'app/constants';
import type { ProductPreview, Category } from 'app/api/types';

type ProductsProps = {
  products: ProductPreview[];
  categories: Category[];
  currentCategory?: Category;
};

export function Products({
  products,
  categories,
  currentCategory,
}: ProductsProps) {
  return (
    <Container>
      <Row>
        <Col>
          <div className={styles.products}>
            <SectionHeader id={NEEDED_SUPPLIES_CONTAINER_ID}>
              Needed supplies
            </SectionHeader>
            <CategorySelector
              categories={categories}
              currentCategory={currentCategory}
            />
            <br />
            products <br />
            {products?.map((product) => {
              return ' ' + product.name + ' ';
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
