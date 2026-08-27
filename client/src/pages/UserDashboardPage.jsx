import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, BookOpen } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppointments } from '../hooks/useAppointments';
import { useToast } from '../hooks/useToast';
import UserStats from '../components/dashboard/UserStats';
import AppointmentList from '../components/dashboard/AppointmentList';
import MyBooks from '../components/dashboard/MyBooks';
import ProofUpload from '../components/ui/ProofUpload';
import Button from '../components/ui/Button';
import { appointmentService } from '../services/appointment.service';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { appointments, sessionsRemaining, sessionsTotal, loading, cancelAppointment } = useAppointments();
  const [proofUrl, setProofUrl] = useState('');
  const [proofSending, setProofSending] = useState(false);
  const { success, error } = useToast();

  const handleCancel = async (id) => {
    if (!confirm('¿Estás seguro de cancelar esta cita?')) return;
    await cancelAppointment(id);
    success('Cita cancelada');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Hola, {user?.firstName} 👋
          </h1>
          <p className="text-gray-500 mt-1">Aquí puedes ver tus libros, citas y más.</p>
        </div>
        <Link to="/booking" className="mt-4 sm:mt-0">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Cita
          </Button>
        </Link>
      </div>

      <UserStats appointments={appointments} />

      {/* Sesiones disponibles */}
      <div className="mb-8 bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Paquete de Asesoría</h3>
            <p className="text-sm text-gray-500 mt-1">4 sesiones por mes — $500 MXN</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary-700">{sessionsRemaining}</p>
            <p className="text-xs text-gray-500">sesiones disponibles</p>
          </div>
        </div>
        {sessionsRemaining === 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800 mb-3">No tienes sesiones en tu paquete. Puedes agendar tu cita y al finalizar adjuntar tu comprobante de pago.</p>
            <ProofUpload
              label="O sube tu comprobante aquí para adelantar el proceso"
              value={proofUrl}
              onChange={async (url) => {
                setProofUrl(url);
                if (url) {
                  try {
                    await appointmentService.uploadSessionProof(url);
                    success('Comprobante enviado. El administrador verificará tu pago.');
                  } catch (e) { error(e.message); }
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Mis Libros */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" />
          Mis Libros
        </h2>
        <MyBooks />
      </div>

      {/* Mis Citas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          Mis Citas
        </h2>
        <AppointmentList appointments={appointments} loading={loading} onCancel={handleCancel} />
      </div>
    </div>
  );
}
