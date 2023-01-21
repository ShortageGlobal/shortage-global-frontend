import styles from './stand-with-ukraine.module.scss';
import Link from 'next/link';

export function StandWithUkraine() {
  return (
    <div className={styles.standWithUkraine}>
      {/* Ukrainian flag */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="20"
        className={styles.flag}
      >
        <rect width="30" height="20" fill="#005BBB" />
        <rect width="30" height="10" y="10" fill="#FFD500" />
      </svg>
      <p>
        We stand with our friends and colleagues in Ukraine. To support Ukraine
        in their time of need visit{' '}
        <Link
          href={{
            pathname: '/[organizationSlug]/',
            query: { organizationSlug: 'nova_ukraine' },
          }}
        >
          the&nbsp;Nova&nbsp;Ukraine&apos;s&nbsp;page
        </Link>
        .
      </p>
    </div>
  );
}
