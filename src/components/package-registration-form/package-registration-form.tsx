import styles from './package-registration-form.module.scss';
import { useCallback, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Trash2 } from 'react-feather';
import { useRouter } from 'next/router';
import { createPackage } from 'app/api';
import { useCart, useCancelToken, isRequestCancel } from 'app/hooks';
import type { FormEvent } from 'react';
import type { Organization, Product, CartItem } from 'app/api/types';

type PackageRegistrationFormProps = {
  organization: Organization;
  initialCartItems: CartItem[];
};
type PackageItem = {
  uuid: CartItem['uuid'];
  name: Product['name'];
  productSlug: Product['slug'];
  organizationSlug: Organization['slug'];
  quantity: CartItem['quantity'];
  displayQuantity: CartItem['quantity'] | string;
};

export function PackageRegistrationForm({
  organization,
  initialCartItems,
}: PackageRegistrationFormProps) {
  const router = useRouter();

  const { deleteFromCart } = useCart();

  const [isCreating, setIsCreating] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [items, setItems] = useState<PackageItem[]>(() =>
    initialCartItems.map((item) => {
      return {
        uuid: item.uuid,
        name: item.product.name,
        productSlug: item.product.slug,
        organizationSlug: item.product.organization.slug,
        quantity: item.quantity,
        displayQuantity: item.quantity,
      };
    })
  );
  const [deliveryCompany, setDeliveryCompany] = useState('');
  const [trackingCode, setTrackingNumber] = useState('');
  const [photo /*, setPhoto */] = useState();
  const [note, setNote] = useState('');

  const getCreatePackageCancelToken = useCancelToken();

  const handleItemQuantityChange = useCallback(
    ({ item, value }: { item: PackageItem; value: string }) => {
      item.displayQuantity = value;
      const quantity = Number(value);
      if (Number.isInteger(quantity) && quantity >= 1) {
        item.quantity = quantity;
      }

      setItems([...items]);
    },
    [items]
  );

  const handleItemQuantityBlur = useCallback(
    ({ item }: { item: PackageItem }) => {
      item.displayQuantity = item.quantity;
      setItems([...items]);
    },
    [items]
  );

  const handleItemRemove = useCallback(
    ({ item }: { item: PackageItem }) => {
      setItems(items.filter((d) => d.uuid !== item.uuid));
    },
    [items]
  );

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const packageItems = items.map((item) => {
        return {
          product: item.productSlug,
          quantity: item.quantity,
        };
      });

      const cancelToken = getCreatePackageCancelToken();

      setIsCreating(true);
      try {
        const response = await createPackage({
          organizationSlug: organization.slug,
          fullName: `${firstName} ${lastName}`.trim(),
          email,
          phoneNumber,
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
          },
        });

        // Remove registered products from the cart
        // TODO: do batch deletion. Or delete on the backend side and refetch the cart
        items.forEach((item) => {
          deleteFromCart({ cartItemId: item.uuid });
        });

        setIsCreating(false);
      } catch (rejection) {
        if (isRequestCancel(rejection)) {
          return;
        }
        setIsCreating(false);
      }
    },
    [
      organization,
      deleteFromCart,
      firstName,
      lastName,
      email,
      phoneNumber,
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
        <h5>Personal Details</h5>

        <p>
          We need your personal information in case there are any issues with
          the delivery of the package.
        </p>
      </header>

      <Row>
        <Col md={6}>
          <Form.Group controlId="first-name" className={styles.formGroup}>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              autoFocus
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="last-name" className={styles.formGroup}>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="email" className={styles.formGroup}>
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="phone" className={styles.formGroup}>
            <Form.Label>Phone Number *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <header className={styles.sectionHeader}>
        <h5>Package Content</h5>
      </header>

      {items.map((item, index) => {
        return (
          <Row key={item.uuid}>
            <Col md={8}>
              <Form.Group
                controlId={`name-${item.uuid}`}
                className={styles.formGroup}
              >
                <Form.Label>Item {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="What's in the package?"
                  value={item.name}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col xs={6} md={2}>
              <Form.Group
                controlId={`quantity-${item.uuid}`}
                className={styles.formGroup}
              >
                <Form.Label>Quantity *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Quantity"
                  required
                  min={1}
                  value={item.displayQuantity}
                  onChange={(e) =>
                    handleItemQuantityChange({ item, value: e.target.value })
                  }
                  onBlur={() => handleItemQuantityBlur({ item })}
                />
              </Form.Group>
            </Col>

            <Col xs={6} md={2} className={styles.removeItemContainer}>
              <Button
                variant="outline-dark"
                className={styles.removeItemButton}
                onClick={() => handleItemRemove({ item })}
                disabled={items.length === 1}
              >
                <Trash2 size="1rem" />
                <span className={styles.removeItemButtonLabel}>Remove</span>
              </Button>
            </Col>
          </Row>
        );
      })}

      <header className={styles.sectionHeader}>
        <h5>Tracking Information</h5>
      </header>

      <Row>
        <Col md={6}>
          <Form.Group controlId="delivery-company" className={styles.formGroup}>
            <Form.Label>Shipping Carrier *</Form.Label>
            <Form.Control
              type="text"
              placeholder="UPS, FedEx, DHL, etc."
              required
              value={deliveryCompany}
              onChange={(e) => setDeliveryCompany(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="tracking-number" className={styles.formGroup}>
            <Form.Label>Tracking Number *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tracking Number"
              required
              value={trackingCode}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </Form.Group>
        </Col>

        {/* Optional photo of package. Decided to exclude because the form is already overloaded with elements */}
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

        <Col>
          <Form.Group controlId="note" className={styles.formGroup}>
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Type something here"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>
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
