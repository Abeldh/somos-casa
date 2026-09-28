import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import Button from '../ui/Button';
import { hasDecided, acceptAll, acceptNecessaryOnly } from '../../utils/cookieConsent';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Mostrar solo si el usuario aún no ha decidido (o si la versión caducó)
    if (!hasDecided()) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAll();
    setShow(false);
  };

  const handleNecessaryOnly = () => {
    acceptNecessaryOnly();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Cookie className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">Tu privacidad es importante</h4>
            <p className="text-sm text-gray-500 mt-1">
              Usamos cookies <strong>necesarias</strong> para el funcionamiento del sitio (sesión y seguridad),
              que no requieren tu consentimiento. Con tu permiso, también usamos cookies{' '}
              <strong>analíticas</strong> (Google Analytics) para entender cómo se usa el sitio y mejorarlo.
              No usamos cookies de publicidad ni de rastreo.{' '}
              <Link to="/cookies" className="text-primary-600 hover:underline">Más información</Link>
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button size="sm" onClick={handleAcceptAll}>Aceptar todas</Button>
              <Button size="sm" variant="outline" onClick={handleNecessaryOnly}>Solo necesarias</Button>
              <Link to="/cookies" className="text-xs text-gray-500 hover:text-primary-600">Configurar preferencias</Link>
            </div>
          </div>
          <button onClick={handleNecessaryOnly} className="text-gray-400 hover:text-gray-600 flex-shrink-0" aria-label="Cerrar y aceptar solo necesarias">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
