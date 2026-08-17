import { useState } from 'react';
import { Plus } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useToast } from '../../hooks/useToast';
import { availabilityService } from '../../services/availability.service';

export default function AvailabilityForm({ selectedDate, onCreated }) {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      error('Selecciona una fecha en el calendario');
      return;
    }
    if (startTime >= endTime) {
      error('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    setLoading(true);
    try {
      await availabilityService.create({ date: selectedDate, startTime, endTime });
      success('Horario agregado');
      onCreated?.();
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
      <h4 className="font-semibold text-gray-900 mb-4">Agregar horario</h4>
      <p className="text-sm text-gray-500 mb-4">
        Fecha seleccionada: <span className="font-medium text-gray-700">{selectedDate || 'Ninguna'}</span>
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input
          label="Hora inicio"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          label="Hora fin"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <Button type="submit" loading={loading} disabled={!selectedDate} className="w-full flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        Agregar Horario
      </Button>
    </form>
  );
}
