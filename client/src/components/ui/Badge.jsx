import { classNames } from '../../utils/helpers';
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';

export default function Badge({ status, className }) {
  return (
    <span className={classNames(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
      STATUS_COLORS[status] || 'bg-gray-100 text-gray-800',
      className
    )}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
