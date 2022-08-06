import styles from './section-header.module.scss';

export function SectionHeader({ children, id = '' }) {
  return (
    <h4 id={id} className={styles.sectionHeader}>
      {children}
    </h4>
  );
}
