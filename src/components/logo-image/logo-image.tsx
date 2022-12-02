import { Shortage, ShortageStaging } from 'components/icons';
import { IS_STAGING } from 'core/constants';

export function LogoImage() {
  return IS_STAGING ? <ShortageStaging /> : <Shortage />;
}
