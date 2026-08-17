import { useEffect } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { useToast } from '../hooks/useToast';
import { appointmentService } from '../services/appointment.service';
import AdminStats from '../components/admin/AdminStats';
import AppointmentsTable from '../components/admin/AppointmentsTable';

export default function AdminDashboardPage() {
  const { appointments, loading, fetchAll } = useAppointments(false);
  const { success, error } = useToast();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      success('Estado actualizado');
      fetchAll();
    } catch (err) {
      error(err.message);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen general de la plataforma.</p>
      </div>

      <AdminStats appointments={appointments} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Citas recientes</h2>
        <AppointmentsTable
          appointments={appointments.slice(0, 10)}
          loading={loading}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
}
