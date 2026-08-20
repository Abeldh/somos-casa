import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import Button from '../ui/Button';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Mostrar después de 1 segundo para no bloquear la carga
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShow(false);
  };

  const reject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
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
            <h4 className="font-semibold text-gray-900 text-sm">Este sitio utiliza cookies</h4>
            <p className="text-sm text-gray-500 mt-1">
              Usamos cookies técnicas necesarias para el funcionamiento del sitio (sesión, seguridad). 
              Los reproductores embebidos de Spotify y YouTube pueden usar cookies propias. 
              No usamos cookies de publicidad ni rastreo.{' '}
              <Link to="/cookies" className="text-primary-600 hover:underline">Más información</Link>
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button size="sm" onClick={accept}>Aceptar todas</Button>
              <Button size="sm" variant="outline" onClick={reject}>Solo necesarias</Button>
              <Link to="/cookies" className="text-xs text-gray-500 hover:text-primary-600">Configurar preferencias</Link>
            </div>
          </div>
          <button onClick={reject} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
