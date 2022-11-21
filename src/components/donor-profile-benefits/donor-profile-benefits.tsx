import styles from './donor-profile-benefits.module.scss';
import classNames from 'classnames';
import { Clock, FileText, Package } from 'react-feather';

type DonorProfileBenefitsProps = {
  className?: string;
};

export function DonorProfileBenefits({
  className = '',
}: DonorProfileBenefitsProps) {
  return (
    <div className={classNames(styles.donorProfileBenefits, className)}>
      <div className={styles.title}>Donor profile benefits</div>

      <ul className={styles.benefitsList}>
        <li className={styles.benefitItem}>
          <Clock /> <span>See donation history</span>
        </li>
        <li className={styles.benefitItem}>
          <Package /> <span>All donations in one place</span>
        </li>
        <li className={styles.benefitItem}>
          <FileText /> <span>Download tax deduction receipts</span>
        </li>
      </ul>
    </div>
  );
}
