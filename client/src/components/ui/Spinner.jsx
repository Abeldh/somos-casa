import { Loader2 } from 'lucide-react';
import { classNames } from '../../utils/helpers';

export default function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className={classNames('flex items-center justify-center', className)}>
      <Loader2 className={classNames(sizes[size], 'animate-spin text-primary-600')} />
    </div>
  );
}
