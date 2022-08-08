import styles from './product-card.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from 'react-bootstrap';
import classNames from 'classnames';
import type { ProductPreview, Slug } from 'app/api/types';

type ProductCardProps = {
  product: ProductPreview;
  organizationSlug: Slug;
};

export function ProductCard({ product, organizationSlug }: ProductCardProps) {
  return (
    <Link
      href={{
        pathname: '/organizations/[organizationSlug]/products/[productSlug]',
        query: { organizationSlug, productSlug: product.slug },
      }}
    >
      <a
        className={styles.productCard}
        title={`Check details of ${product.name}`}
      >
        <Card>
          <div className={styles.imageContainer}>
            <Image
              src={product.photo}
              alt={product.name}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <Card.Body>
            <Card.Title className={classNames(styles.title, 'text-truncate')}>
              {product.name}
            </Card.Title>

            <Card.Text as="div">
              <p className={classNames(styles.price, 'text-truncate')}>
                {product.price}
              </p>
            </Card.Text>

            <span
              className={classNames(
                'btn',
                'btn-primary',
                styles.checkDetailsButton
              )}
            >
              Check details
            </span>
          </Card.Body>
        </Card>
      </a>
    </Link>
  );
}
