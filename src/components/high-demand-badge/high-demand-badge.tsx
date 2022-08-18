import styles from './high-demand-badge.module.scss';
import Badge from 'react-bootstrap/Badge';
import classNames from 'classnames';

export function HighDemandBadge({ className }) {
  return (
    <Badge
      className={classNames(styles.highDemandBadge, className)}
      bg="warning"
      text="dark"
    >
      High demand
    </Badge>
  );
}
