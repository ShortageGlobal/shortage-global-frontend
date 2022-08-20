import styles from 'styles/pages/product.module.scss';
import Head from 'next/head';
import Link from 'next/link';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { formatPrice } from 'app/helpers';
import { useAppSelector } from 'app/hooks';
import { wrapper } from 'app/store';
import { fetchProduct } from 'app/store/slices/product';
import { fetchInstructions } from 'app/store/slices/instructions';
import { fetchOnlineStores } from 'app/store/slices/online-stores';
import { selectProduct } from 'app/store/slices/product';
// import { selectInstructions } from 'app/store/slices/instructions';
// import { selectOnlineStores } from 'app/store/slices/online-stores';
import { HighDemandBadge } from 'components/high-demand-badge/high-demand-badge';
import type { NextPageWithLayout } from 'pages/_app';

const ProductPage: NextPageWithLayout = () => {
  const { product } = useAppSelector(selectProduct);
  // const { instructions } = useAppSelector(selectInstructions);
  // const { onlineStores } = useAppSelector(selectOnlineStores);

  return (
    <>
      <Head>
        <title>{product.name} | ShortageGlobal</title>
      </Head>

      <Container>
        <Row>
          {/* Photo */}
          <Col md={6} className={styles.photoContainer}>
            <img
              src={product.photo}
              alt={product.name}
              className={styles.photo}
            />
          </Col>

          {/* Details */}
          <Col md={6} className={styles.details}>
            {/* Name */}
            <h2 className={styles.name}>{product.name}</h2>

            {/* High demand badge */}
            {product.top_priority ? <HighDemandBadge /> : null}

            {/* Price */}
            <div>
              <span className={styles.price}>{formatPrice(product.price)}</span>{' '}
              <span>retail price</span>
            </div>

            {/* Requested amount */}
            <div>
              <div className={styles.requestedAmount}>
                {product.requested_amount} items
              </div>
              <div>
                requested by{' '}
                <Link
                  href={{
                    pathname: '/organizations/[organizationSlug]',
                    query: { organizationSlug: product.organization.slug },
                  }}
                >
                  <a>{product.organization.name}</a>
                </Link>
              </div>
            </div>

            {/* Order and deliver */}
            <div className={styles.orderSection}>
              <h5>Order and deliver in a few clicks</h5>

              <div className={styles.buttonsGroup}>
                <Button size="lg">I want to order</Button>
                <Button size="lg" variant="outline-dark">
                  I want to send
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Minimal Requirements (Description) */}
          <Col
            xl={{ span: 8, offset: 2 }}
            className={styles.descriptionContainer}
          >
            <h4>Minimal Requirements</h4>

            {product.description ? (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <div className={styles.description}>
                <p>No requirements are provided for this product.</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const organizationSlug = context.params.organizationSlug as string;
    const productSlug = context.params.productSlug as string;

    await Promise.all([
      store.dispatch(fetchProduct({ organizationSlug, productSlug })),
      store.dispatch(fetchOnlineStores({ organizationSlug, productSlug })),
      store.dispatch(fetchInstructions({ organizationSlug })),
    ]);

    return {
      props: {},
    };
  }
);

export default ProductPage;
