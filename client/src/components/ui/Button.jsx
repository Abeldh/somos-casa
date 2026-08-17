import { Loader2 } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  danger: 'bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200',
  ghost: 'text-gray-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-all duration-200',
};

const sizes = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3 px-6',
  lg: 'py-4 px-8 text-lg',
};

export default function Button({ children, variant = 'primary', size = 'md', loading, disabled, className, ...props }) {
  return (
    <button
      className={classNames(variants[variant], sizes[size], disabled && 'opacity-50 cursor-not-allowed', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin inline mr-2" />}
      {children}
    </button>
  );
}
