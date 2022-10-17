import Image from 'next/image';
import { IS_STAGING } from 'app/constants';

export function LogoImage() {
  const src = IS_STAGING
    ? '/images/logo/Shortage_staging.svg'
    : '/images/logo/Shortage.svg';

  return <Image src={src} alt="Shortage" layout="fill" priority />;
}
