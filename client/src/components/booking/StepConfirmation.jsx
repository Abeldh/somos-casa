import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function StepConfirmation() {
  return (
    <div className="max-w-md mx-auto text-center animate-fade-in py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 mb-2">¡Cita agendada!</h3>
      <p className="text-gray-600 mb-8">
        Tu solicitud fue enviada con éxito. Recibirás una confirmación cuando el asesor apruebe tu cita.
      </p>

      <div className="space-y-3">
        <Link to="/dashboard">
          <Button className="w-full flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Ver mis citas
          </Button>
        </Link>
        <Link to="/">
          <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
            Volver al inicio
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
