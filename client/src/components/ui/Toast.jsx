import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { classNames } from '../../utils/helpers';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'bg-green-50 border-green-300 text-green-800',
  error: 'bg-red-50 border-red-300 text-red-800',
  info: 'bg-blue-50 border-blue-300 text-blue-800',
  warning: 'bg-amber-50 border-amber-300 text-amber-800',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-amber-500',
};

const titles = {
  success: '¡Éxito!',
  error: 'Error',
  info: 'Información',
  warning: 'Atención',
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={classNames(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-2 shadow-xl animate-slide-up backdrop-blur-sm',
              colors[toast.type]
            )}
            role="alert"
          >
            <div className={classNames('flex-shrink-0 mt-0.5', iconColors[toast.type])}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide opacity-70">
                {titles[toast.type]}
              </p>
              <p className="text-sm font-medium mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
