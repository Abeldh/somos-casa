import { useState, useEffect, useCallback } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { availabilityService } from '../services/availability.service';
import { formatTime, toISODate } from '../utils/formatDate';
import AvailabilityCalendar from '../components/admin/AvailabilityCalendar';
import AvailabilityForm from '../components/admin/AvailabilityForm';
import Spinner from '../components/ui/Spinner';

export default function AdminAvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const fetchMonth = useCallback(async () => {
    const now = new Date();
    try {
      const data = await availabilityService.getByMonth(now.getFullYear(), now.getMonth() + 1);
      setAvailableDates(data.dates || []);
    } catch (err) {
      error(err.message);
    }
  }, [error]);

  const fetchSlots = useCallback(async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const data = await availabilityService.getByDate(selectedDate);
      setSlots(data.slots || []);
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, error]);

  useEffect(() => { fetchMonth(); }, [fetchMonth]);
  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const handleDelete = async (id) => {
    try {
      await availabilityService.remove(id);
      success('Horario eliminado');
      fetchSlots();
      fetchMonth();
    } catch (err) {
      error(err.message);
    }
  };

  const handleCreated = () => {
    fetchSlots();
    fetchMonth();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Disponibilidad</h1>
        <p className="text-gray-500 mt-1">Configura los días y horarios disponibles para asesorías.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <AvailabilityCalendar
            availableDates={availableDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        <div>
          <AvailabilityForm selectedDate={selectedDate} onCreated={handleCreated} />
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-600" />
              Horarios del día
            </h4>

            {!selectedDate ? (
              <p className="text-sm text-gray-500">Selecciona un día para ver sus horarios.</p>
            ) : loading ? (
              <Spinner />
            ) : slots.length === 0 ? (
              <p className="text-sm text-gray-500">Sin horarios configurados.</p>
            ) : (
              <div className="space-y-2">
                {slots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                    <div className="flex items-center gap-2">
                      {slot.isBooked && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Reservado</span>
                      )}
                      <button onClick={() => handleDelete(slot.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
