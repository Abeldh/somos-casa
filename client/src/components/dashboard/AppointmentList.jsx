import { CalendarX } from 'lucide-react';
import AppointmentCard from './AppointmentCard';
import Spinner from '../ui/Spinner';

export default function AppointmentList({ appointments, loading, onCancel }) {
  if (loading) return <Spinner className="py-12" />;

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Sin citas</h3>
        <p className="text-sm text-gray-500">Aún no tienes citas agendadas.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {appointments.map((apt) => (
        <AppointmentCard key={apt.id} appointment={apt} onCancel={onCancel} />
      ))}
    </div>
  );
}
