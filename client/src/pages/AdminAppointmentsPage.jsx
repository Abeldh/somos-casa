import { useEffect, useState } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { useToast } from '../hooks/useToast';
import { appointmentService } from '../services/appointment.service';
import AppointmentsTable from '../components/admin/AppointmentsTable';
import Select from '../components/ui/Select';

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'CONFIRMED', label: 'Confirmadas' },
  { value: 'COMPLETED', label: 'Completadas' },
  { value: 'CANCELLED', label: 'Canceladas' },
];

export default function AdminAppointmentsPage() {
  const { appointments, loading, fetchAll } = useAppointments(false);
  const { success, error } = useToast();
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchAll(filter ? { status: filter } : {});
  }, [fetchAll, filter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      success('Estado actualizado');
      fetchAll(filter ? { status: filter } : {});
    } catch (err) {
      error(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Gestión de Citas</h1>
          <p className="text-gray-500 mt-1">Administra todas las citas de asesoría.</p>
        </div>
        <div className="mt-4 sm:mt-0 w-48">
          <Select
            options={statusOptions}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <AppointmentsTable
        appointments={appointments}
        loading={loading}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
