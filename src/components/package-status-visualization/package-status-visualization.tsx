import styles from './package-status-visualization.module.scss';
import classNames from 'classnames';
import Image from 'next/image';
import { PACKAGE_STATUS, PACKAGE_STATUS_LIFECYCLE } from 'core/constants';
import type { Package, PackageStatus } from 'core/api/types';

const PACKAGE_DISPLAY_LABELS = Object.freeze({
  [PACKAGE_STATUS.REGISTERED]: 'Registered',
  [PACKAGE_STATUS.PAYMENT_CANCELED]: 'Payment Canceled',
  [PACKAGE_STATUS.PAYMENT_FAILED]: 'Payment Failed',
  [PACKAGE_STATUS.PAYMENT_PROCESSING]: 'Processing',
  [PACKAGE_STATUS.PAYMENT_SUCCEEDED]: 'Processing', // same as PAYMENT_PROCESSING
  [PACKAGE_STATUS.CONFIRMED]: 'Confirmed',
  [PACKAGE_STATUS.ON_ITS_WAY]: 'On Its Way',
  [PACKAGE_STATUS.DELIVERED]: 'Delivered',
});

const PACKAGE_STATUS_GLYPHS = Object.freeze({
  [PACKAGE_STATUS.REGISTERED]: '/images/package-status-glyphs/registered.svg',

  [PACKAGE_STATUS.PAYMENT_CANCELED]:
    '/images/package-status-glyphs/payment.svg',
  [PACKAGE_STATUS.PAYMENT_FAILED]: '/images/package-status-glyphs/payment.svg',
  [PACKAGE_STATUS.PAYMENT_PROCESSING]:
    '/images/package-status-glyphs/payment.svg',
  [PACKAGE_STATUS.PAYMENT_SUCCEEDED]:
    '/images/package-status-glyphs/payment.svg',

  [PACKAGE_STATUS.CONFIRMED]: '/images/package-status-glyphs/confirmed.svg',
  [PACKAGE_STATUS.ON_ITS_WAY]: '/images/package-status-glyphs/on_its_way.svg',
  [PACKAGE_STATUS.DELIVERED]: '/images/package-status-glyphs/delivered.svg',
});

type PackageStatusVizualizationProps = {
  package: Package;
};

export function PackageStatusVisualization({
  package: packageState,
}: PackageStatusVizualizationProps) {
  const lifecycle = PACKAGE_STATUS_LIFECYCLE[packageState.type];

  let activeLifecycleIndex = +Infinity;

  return (
    <div className={styles.packageStatusVisualizationWrap}>
      <ul className={styles.packageStatusVisualization}>
        {lifecycle.map((steps, index) => {
          let step: PackageStatus;

          if (steps.includes(packageState.status)) {
            step = packageState.status;
            activeLifecycleIndex = index;
          } else {
            step = steps[0] as PackageStatus;
          }

          const isActive = index <= activeLifecycleIndex;
          const isFailure =
            PACKAGE_STATUS.PAYMENT_FAILED === step ||
            PACKAGE_STATUS.PAYMENT_CANCELED === step;
          const notFirstStep = index !== 0;

          return (
            <li
              key={step}
              className={classNames(styles.step, {
                [styles.active]: isActive,
                [styles.failed]: isFailure,
                [styles.withDelimiter]: notFirstStep,
              })}
            >
              <div className={styles.stepBullet}>
                <div className={styles.glyph}>
                  <Image
                    src={PACKAGE_STATUS_GLYPHS[step]}
                    layout="fill"
                    alt=""
                  />
                </div>
              </div>
              <div className={styles.stepLabel}>
                {PACKAGE_DISPLAY_LABELS[step]}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
