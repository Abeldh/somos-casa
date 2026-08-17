import { classNames } from '../../utils/helpers';

export default function Textarea({ label, error, className, ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        className={classNames('input-field min-h-[100px] resize-y', error && 'border-red-400', className)}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
