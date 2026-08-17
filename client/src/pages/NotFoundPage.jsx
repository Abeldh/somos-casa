import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-primary-200">404</p>
        <h1 className="mt-4 text-2xl font-display font-bold text-gray-900">Página no encontrada</h1>
        <p className="mt-2 text-gray-500">Lo sentimos, la página que buscas no existe o fue movida.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/">
            <Button className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Ir al Inicio
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </button>
        </div>
      </div>
    </div>
  );
}
