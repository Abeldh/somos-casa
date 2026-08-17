import { Clock } from 'lucide-react';
import { formatTime } from '../../utils/formatDate';
import { classNames } from '../../utils/helpers';
import Spinner from '../ui/Spinner';

export default function TimeSlotGrid({ slots = [], selectedSlot, onSelectSlot, loading }) {
  if (loading) return <Spinner className="py-8" />;

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No hay horarios disponibles para este día.</p>
      </div>
    );
  }

  const available = slots.filter((s) => !s.isBooked);

  if (available.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">Todos los horarios están ocupados para este día.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-3">
        Horarios disponibles ({available.length})
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {available.map((slot) => (
          <button
            key={slot.id}
            onClick={() => onSelectSlot(slot)}
            className={classNames(
              'flex items-center justify-center gap-2 py-3 px-4 rounded-lg border text-sm font-medium transition-all',
              selectedSlot?.id === slot.id
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50/50'
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </button>
        ))}
      </div>
    </div>
  );
}
