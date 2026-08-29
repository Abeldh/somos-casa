import { useEffect, useState } from 'react';
import { Video, Unlock, Calendar, Clock, User } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { useToast } from '../hooks/useToast';
import { appointmentService } from '../services/appointment.service';
import { formatDate, formatTime } from '../utils/formatDate';
import AppointmentsTable from '../components/admin/AppointmentsTable';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'CONFIRMED', label: 'Confirmadas' },
  { value: 'COMPLETED', label: 'Completadas' },
  { value: 'CANCELLED', label: 'Canceladas' },
];

export default function AdminAppointmentsPage() {
  const { appointments, loading, pagination, fetchAll } = useAppointments(false);
  const { success, error } = useToast();
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [zoomModal, setZoomModal] = useState(null);
  const [zoomUrl, setZoomUrl] = useState('');
  const [releaseModal, setReleaseModal] = useState(null);
  const [releaseSessions, setReleaseSessions] = useState(4);

  const buildParams = () => ({ ...(filter ? { status: filter } : {}), page, limit });

  useEffect(() => { fetchAll(buildParams()); }, [fetchAll, filter, page, limit]);

  const changeFilter = (v) => { setFilter(v); setPage(1); };
  const changeLimit = (l) => { setLimit(l); setPage(1); };

  const handleUpdateStatus = async (id, status) => {
    try { await appointmentService.updateStatus(id, status); success('Estado actualizado'); fetchAll(buildParams()); }
    catch (err) { error(err.message); }
  };

  const handleSetZoom = async () => {
    if (!zoomUrl) { error('Ingresa la URL de Zoom'); return; }
    try {
      await appointmentService.setZoomUrl(zoomModal.id, zoomUrl);
      success('URL de Zoom agregada');
      setZoomModal(null);
      setZoomUrl('');
      fetchAll(buildParams());
    } catch (err) { error(err.message); }
  };

  const handleReleaseSessions = async () => {
    try {
      await appointmentService.releaseSessions(releaseModal.id, releaseSessions);
      success(`${releaseSessions} sesiones liberadas para ${releaseModal.firstName}`);
      setReleaseModal(null);
      fetchAll(buildParams());
    } catch (err) { error(err.message); }
  };

  // Extraer usuarios únicos de las citas
  const uniqueUsers = [...new Map(appointments.filter(a => a.user).map(a => [a.user.id, a.user])).values()];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Gestión de Citas</h1>
          <p className="text-gray-500 mt-1">Administra citas, sesiones y links de Zoom.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select options={statusOptions} value={filter} onChange={(e) => changeFilter(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Liberar sesiones por usuario */}
      {uniqueUsers.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Unlock className="w-4 h-4 text-primary-600" />
            Liberar Sesiones (Paquete $500/mes — 4 sesiones)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {uniqueUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-gray-500">
                    Sesiones: <span className="font-bold text-primary-700">{u.sessionsRemaining ?? '?'}</span> restantes
                  </p>
                  {u.paymentProofUrl && (
                    <a href={u.paymentProofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">📎 Ver comprobante</a>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setReleaseModal(u)}
                  className="flex items-center gap-1"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  Liberar
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de citas */}
      <AppointmentsTable
        appointments={appointments}
        loading={loading}
        onUpdateStatus={handleUpdateStatus}
        onSetZoom={(apt) => { setZoomModal(apt); setZoomUrl(apt.zoomUrl || ''); }}
      />

      {!loading && appointments.length > 0 && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={changeLimit}
        />
      )}

      {/* Modal: Agregar URL Zoom */}
      <Modal isOpen={!!zoomModal} onClose={() => setZoomModal(null)} title="URL de Sesión Zoom">
        {zoomModal && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p><strong>Cita:</strong> {formatDate(zoomModal.date)} • {formatTime(zoomModal.startTime)}</p>
              <p><strong>Cliente:</strong> {zoomModal.user?.firstName} {zoomModal.user?.lastName}</p>
            </div>
            <Input
              label="URL de Zoom"
              value={zoomUrl}
              onChange={(e) => setZoomUrl(e.target.value)}
              placeholder="https://zoom.us/j/1234567890"
            />
            <Button onClick={handleSetZoom} className="w-full flex items-center justify-center gap-2">
              <Video className="w-4 h-4" />
              Guardar URL
            </Button>
          </div>
        )}
      </Modal>

      {/* Modal: Liberar sesiones */}
      <Modal isOpen={!!releaseModal} onClose={() => setReleaseModal(null)} title="Liberar Sesiones">
        {releaseModal && (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4 text-sm text-green-800">
              <p>Vas a liberar sesiones para <strong>{releaseModal.firstName} {releaseModal.lastName}</strong>.</p>
              <p className="mt-1">Esto confirma que el pago mensual fue recibido.</p>
            </div>
            <Input
              label="Número de sesiones a liberar"
              type="number"
              value={releaseSessions}
              onChange={(e) => setReleaseSessions(parseInt(e.target.value) || 4)}
              min="1"
              max="12"
            />
            <Button onClick={handleReleaseSessions} className="w-full flex items-center justify-center gap-2">
              <Unlock className="w-4 h-4" />
              Confirmar Pago y Liberar {releaseSessions} Sesiones
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
