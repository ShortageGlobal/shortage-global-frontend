import styles from './stand-with-ukraine.module.scss';
import Image from 'next/image';
import Link from 'next/link';

export function StandWithUkraine() {
  return (
    <div className={styles.standWithUkraine}>
      <Image src="/images/ukraine.svg" alt="Ukraine" width={30} height={20} />
      <p>
        We stand with our friends and colleagues in Ukraine. To support Ukraine
        in their time of need visit{' '}
        <Link
          href={{
            pathname: '/organizations/[organizationSlug]/',
            query: { organizationSlug: 'nova_ukraine' },
          }}
        >
          this page
        </Link>
        .
      </p>
    </div>
  );
}
