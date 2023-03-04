import Badge from 'react-bootstrap/Badge';
import classNames from 'classnames';

type Props = {
  className?: string;
};

export function HighDemandBadge({ className }: Props) {
  return (
    <Badge className={classNames(className)} bg="warning" text="dark">
      High demand
    </Badge>
  );
}
