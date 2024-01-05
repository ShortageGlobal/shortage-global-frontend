import styles from './package-status-visualization.module.scss';
import classNames from 'classnames';
import Image from 'next/image';
import {
  PACKAGE_STATUS_DISPLAY_LABELS,
  PACKAGE_STATUS_GLYPHS,
  PACKAGE_STATUS,
  PACKAGE_STATUS_LIFECYCLE,
} from 'core/constants';
import type { Package, PackageStatus } from 'core/api/types';

type PackageStatusVizualizationProps = {
  type: Package['type'];
  status: Package['status'];
  className?: string;
};

export function PackageStatusVisualization({
  type,
  status,
  className = '',
}: PackageStatusVizualizationProps) {
  const lifecycle = PACKAGE_STATUS_LIFECYCLE[type];

  let activeLifecycleIndex = +Infinity;

  return (
    <div
      className={classNames(styles.packageStatusVisualizationWrap, className)}
    >
      <ul className={styles.packageStatusVisualization}>
        {lifecycle.map((steps, index) => {
          let step: PackageStatus;

          if (steps.includes(status)) {
            step = status;
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
                  <Image src={PACKAGE_STATUS_GLYPHS[step]} fill alt="" />
                </div>
              </div>
              <div className={styles.stepLabel}>
                {PACKAGE_STATUS_DISPLAY_LABELS[step]}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
