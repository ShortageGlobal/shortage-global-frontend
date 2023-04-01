import styles from './draft-warning.module.scss';
import Link from 'next/link';
import { Edit3 } from 'react-feather';
import type { LinkProps } from 'next/link';

type DraftWarningProps = {
  adminHref: LinkProps['href'];
};

export function DraftWarning({ adminHref }: DraftWarningProps) {
  return (
    <Link href={adminHref} className={styles.draftWarning}>
      <Edit3 size="1rem" />
      <div>
        This page is a draft. Only you can see it. Got it?{' '}
        <span className="text-nowrap">Click to edit</span>
      </div>
    </Link>
  );
}
