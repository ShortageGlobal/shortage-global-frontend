import styles from './permission-denied.module.scss';
import { Key } from 'react-feather';
import Link from 'next/link';

export function PermissionDenied() {
  return (
    <div className={styles.permissionDenied}>
      <Key size="3rem" />

      <div className={styles.message}>
        <span>You don&apos;t have permission to see this page</span>
      </div>

      <Link href="/" className="btn btn-outline-dark">
        Get me to Homepage
      </Link>
    </div>
  );
}
