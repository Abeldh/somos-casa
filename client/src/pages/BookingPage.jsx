import { Calendar } from 'lucide-react';
import BookingForm from '../components/booking/BookingForm';

export default function BookingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
          <Calendar className="w-4 h-4" />
          Agendar Cita
        </div>
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Agenda tu sesión de asesoría
        </h1>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto">
          Selecciona una fecha y horario disponible, cuéntanos sobre tu pareja y confirma tu cita.
        </p>
      </div>

      <BookingForm />
    </div>
  );
}
