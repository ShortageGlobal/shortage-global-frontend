import styles from './package-registration-form.module.scss';
import { useCallback, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { createPackage } from 'app/api';
import { useCart, useCancelToken, isRequestCancel } from 'app/hooks';
import { CartItem } from 'components/cart/cart-item/cart-item';
import { ReviewDonationDetails } from 'components/review-donation-details/review-donation-details';
import { PACKAGE_TYPE } from 'app/constants';
import type { FormEvent } from 'react';
import type { Organization, CartItem as CartItemType } from 'app/api/types';

type PackageRegistrationFormProps = {
  organization: Organization;
  items: CartItemType[];
};

export function PackageRegistrationForm({
  organization,
  items,
}: PackageRegistrationFormProps) {
  const router = useRouter();

  const { cart, updateCartItemQuantity, deleteFromCart } = useCart();

  const [isCreating, setIsCreating] = useState(false);

  const [deliveryCompany, setDeliveryCompany] = useState('');
  const [trackingCode, setTrackingNumber] = useState('');
  const [photo /*, setPhoto */] = useState();
  const [note, setNote] = useState('');

  const getCreatePackageCancelToken = useCancelToken();

  const handleItemQuantityChange = useCallback(
    async ({ item, quantity }: { item: CartItemType; quantity: number }) => {
      try {
        await updateCartItemQuantity({ cartItemId: item.uuid, quantity });
      } catch (rejection) {
        if (!isRequestCancel(rejection)) {
          throw rejection;
        }
      }
    },
    [updateCartItemQuantity]
  );

  const handleItemRemove = useCallback(
    async ({ item }: { item: CartItemType }) => {
      try {
        await deleteFromCart({ cartItemId: item.uuid });
      } catch (rejection) {
        if (!isRequestCancel(rejection)) {
          throw rejection;
        }
      }
    },
    [deleteFromCart]
  );

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const packageItems = items.map((item) => {
        return {
          product: item.product.slug,
          quantity: item.quantity,
        };
      });

      const cancelToken = getCreatePackageCancelToken();

      setIsCreating(true);
      try {
        const response = await createPackage({
          type: PACKAGE_TYPE.SENT_BY_DONOR,
          organizationSlug: organization.slug,
          firstName: cart.first_name,
          lastName: cart.last_name,
          email: cart.email,
          phoneNumber: cart.phone_number,
          needTaxDeduction: cart.need_tax_deduction,
          addressLine1: cart.address_line1,
          addressLine2: cart.address_line2,
          city: cart.city,
          stateProvinceRegion: cart.state_province_region,
          zip: cart.zip,
          country: cart.country,
          items: packageItems,
          deliveryCompany,
          trackingCode,
          photo,
          note,
          cancelToken,
        });

        router.push({
          pathname: '/organizations/[organizationSlug]/packages/[packageId]',
          query: {
            organizationSlug: organization.slug,
            packageId: response.data.uuid,
            dci: items.map((item) => item.uuid),
          },
        });
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsCreating(false);
      }
    },
    [
      organization,
      handleItemRemove,
      cart,
      items,
      deliveryCompany,
      trackingCode,
      photo,
      note,
    ]
  );

  return (
    <Form
      onSubmit={handleFormSubmit}
      className={styles.packageRegistrationForm}
    >
      <header className={styles.sectionHeader}>
        <h5>Package Content</h5>
      </header>

      <div className={styles.packageContentItems}>
        {items.map((item) => {
          return (
            <CartItem
              key={item.uuid}
              item={item}
              onQuantityChange={handleItemQuantityChange}
              onRemove={handleItemRemove}
            />
          );
        })}
      </div>

      <header className={styles.sectionHeader}>
        <h5>Tracking Information</h5>
      </header>

      <div className={styles.formGroupsWrapper}>
        <Row>
          <Col md={6}>
            <Form.Group
              controlId="delivery-company"
              className={styles.formGroup}
            >
              <Form.Label>Shipping Carrier *</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder="UPS, FedEx, DHL, etc."
                required
                value={deliveryCompany}
                onChange={(e) => setDeliveryCompany(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group
              controlId="tracking-number"
              className={styles.formGroup}
            >
              <Form.Label>Tracking Number *</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder=""
                required
                value={trackingCode}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Optional photo of package. Decided to exclude because the form is already overloaded with elements */}
        {/*<Row>*/}
        {/*<Col>*/}
        {/*  <Form.Group>*/}
        {/*    <Form.Label htmlFor="photo">Photo</Form.Label>*/}
        {/*    <Form.Control*/}
        {/*      type="file"*/}
        {/*      className="form-control form-control-sm"*/}
        {/*      id="photo"*/}
        {/*      onChange={(e) => setPhoto(e.target.files[0])}*/}
        {/*    />*/}
        {/*  </Form.Group>*/}
        {/*</Col>*/}
        {/*</Row>*/}

        <Row>
          <Col>
            <Form.Group controlId="note" className={styles.formGroup}>
              <Form.Label>Notes</Form.Label>
              <Form.Control
                size="lg"
                as="textarea"
                placeholder="Type something here"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      <header className={styles.sectionHeader}>
        <h5>Donation Details</h5>
      </header>

      <Row>
        <Col>
          <ReviewDonationDetails className={styles.reviewDonationDetails} />
        </Col>
      </Row>

      <Row>
        <Col>
          <Button
            type="submit"
            size="lg"
            disabled={isCreating}
            className={styles.confirmPackageDetailsBtn}
          >
            Confirm package details
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
