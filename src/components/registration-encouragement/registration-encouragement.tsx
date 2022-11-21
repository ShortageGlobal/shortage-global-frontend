import styles from './registration-encouragement.module.scss';
import { useCallback } from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { DonorProfileBenefits } from 'components/donor-profile-benefits/donor-profile-benefits';

export function RegistrationEncouragement() {
  const handleSignInClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      signIn(); // there should be ?callbackUrl query parameter
    },
    [signIn]
  );

  return (
    <div className={styles.registrationEncouragement}>
      <div className={styles.controls}>
        <Link href="/account/create-account/" passHref legacyBehavior>
          <Button variant="outline-primary">Register a donor account</Button>
        </Link>

        <OverlayTrigger
          placement="bottom"
          overlay={
            <Popover>
              <Popover.Body>
                <DonorProfileBenefits />
              </Popover.Body>
            </Popover>
          }
        >
          <span role="button" className={styles.hint}>
            <span>Why?</span>
          </span>
        </OverlayTrigger>
      </div>

      <div>
        Already have an account?{' '}
        <Link
          href="/account/sign-in/"
          onClick={handleSignInClick}
          className={styles.signInLink}
        >
          Click here to sign in
        </Link>
      </div>
    </div>
  );
}
