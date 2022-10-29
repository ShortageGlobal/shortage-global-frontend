import styles from './review-donation-details.module.scss';
import classNames from 'classnames';
import { Row, Col, Button, Accordion } from 'react-bootstrap';
import Link from 'next/link';
import { useCart } from 'core/hooks';
import { Edit3 } from 'react-feather';

type ReviewDonationDetailsProps = {
  className?: string;
};

export function ReviewDonationDetails({
  className = '',
}: ReviewDonationDetailsProps) {
  const { cart } = useCart();

  return (
    <>
      <Accordion
        className={classNames(styles.reviewDonationDetails, className)}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>Review Donation Details</Accordion.Header>
          <Accordion.Body as="dl" className={styles.body}>
            <Row>
              {cart.first_name ? (
                <Col>
                  <dt>First Name</dt>
                  <dd>{cart.first_name}</dd>
                </Col>
              ) : null}
              {cart.last_name ? (
                <Col>
                  <dt>Last Name</dt>
                  <dd>{cart.last_name}</dd>
                </Col>
              ) : null}
            </Row>

            <Row>
              {cart.email ? (
                <Col>
                  <dt>Email</dt>
                  <dd>{cart.email}</dd>
                </Col>
              ) : null}
              {cart.phone_number ? (
                <Col>
                  <dt>Phone Number</dt>
                  <dd>{cart.phone_number}</dd>
                </Col>
              ) : null}
            </Row>

            <Row>
              <Col>
                <dt>Request Tax Deduction</dt>
                <dd>{cart.need_tax_deduction ? 'Yes' : 'No'}</dd>
              </Col>
            </Row>

            {cart.need_tax_deduction ? (
              <>
                <Row>
                  {cart.address_line1 ? (
                    <Col>
                      <dt>Address Line 1</dt>
                      <dd>{cart.address_line1}</dd>
                    </Col>
                  ) : null}
                  {cart.address_line2 ? (
                    <Col>
                      <dt>Address Line 2</dt>
                      <dd>{cart.address_line2}</dd>
                    </Col>
                  ) : null}
                </Row>

                <Row>
                  {cart.city ? (
                    <Col>
                      <dt>City</dt>
                      <dd>{cart.city}</dd>
                    </Col>
                  ) : null}

                  {cart.state_province_region ? (
                    <Col>
                      <dt>State / Province</dt>
                      <dd>{cart.state_province_region}</dd>
                    </Col>
                  ) : null}
                </Row>

                <Row>
                  {cart.zip ? (
                    <Col>
                      <dt>Zip</dt>
                      <dd>{cart.zip}</dd>
                    </Col>
                  ) : null}

                  {cart.country ? (
                    <Col>
                      <dt>Country</dt>
                      <dd>{cart.country}</dd>
                    </Col>
                  ) : null}
                </Row>
              </>
            ) : null}

            <Link href={{ pathname: '/donation/details' }} passHref>
              <Button variant="outline-dark" className={styles.editButton}>
                <Edit3 />
                <span>Change donation details</span>
              </Button>
            </Link>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
