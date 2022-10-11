import styles from './package-status-visualization.module.scss';
import classNames from 'classnames';
import {
  PACKAGE_STATUS_LIFECYCLE,
  PACKAGE_DISPLAY_LABELS,
} from 'app/constants';
import type { Package, PackageStatus } from 'app/api/types';

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
          const notFirstStep = index !== 0;

          return (
            <li
              key={step}
              className={classNames(styles.step, {
                [styles.active]: isActive,
                [styles.withDelimiter]: notFirstStep,
              })}
            >
              <div className={styles.stepBullet} />
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
