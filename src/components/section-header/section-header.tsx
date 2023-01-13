import styles from './section-header.module.scss';
import classNames from 'classnames';

export function SectionHeader({ children, className = '', id = '' }) {
  return (
    <h4 id={id} className={classNames(styles.sectionHeader, className)}>
      {children}
    </h4>
  );
}
