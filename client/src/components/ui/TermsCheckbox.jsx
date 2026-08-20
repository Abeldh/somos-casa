import { Link } from 'react-router-dom';

export default function TermsCheckbox({ checked, onChange, error }) {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
        />
        <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
          He leído y acepto los{' '}
          <Link to="/terms" target="_blank" className="text-primary-600 hover:underline font-medium">
            Términos y Condiciones
          </Link>{' '}
          y el{' '}
          <Link to="/privacy" target="_blank" className="text-primary-600 hover:underline font-medium">
            Aviso de Privacidad
          </Link>
        </span>
      </label>
      {error && <p className="text-sm text-red-500 ml-7">{error}</p>}
    </div>
  );
}
