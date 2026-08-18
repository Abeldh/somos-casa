import { Calendar, Clock, User } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatDate';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

export default function AppointmentsTable({ appointments, loading, onUpdateStatus }) {
  if (loading) return <Spinner className="py-12" />;

  if (appointments.length === 0) {
    return <p className="text-center text-gray-500 py-8">No hay citas registradas.</p>;
  }

  return (
    <>
      {/* Desktop: Table */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Pareja</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Hora</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {apt.user?.firstName} {apt.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{apt.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{apt.partnerName}</td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(apt.date)}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={apt.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {apt.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="primary" onClick={() => onUpdateStatus(apt.id, 'CONFIRMED')}>
                            Confirmar
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => onUpdateStatus(apt.id, 'CANCELLED')}>
                            Rechazar
                          </Button>
                        </>
                      )}
                      {apt.status === 'CONFIRMED' && (
                        <Button size="sm" variant="secondary" onClick={() => onUpdateStatus(apt.id, 'COMPLETED')}>
                          Completar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Cards */}
      <div className="lg:hidden space-y-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {apt.user?.firstName} {apt.user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{apt.user?.email}</p>
              </div>
              <Badge status={apt.status} />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>Pareja: {apt.partnerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{formatDate(apt.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{formatTime(apt.startTime)} - {formatTime(apt.endTime)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {apt.status === 'PENDING' && (
                <>
                  <Button size="sm" variant="primary" className="flex-1" onClick={() => onUpdateStatus(apt.id, 'CONFIRMED')}>
                    Confirmar
                  </Button>
                  <Button size="sm" variant="danger" className="flex-1" onClick={() => onUpdateStatus(apt.id, 'CANCELLED')}>
                    Rechazar
                  </Button>
                </>
              )}
              {apt.status === 'CONFIRMED' && (
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => onUpdateStatus(apt.id, 'COMPLETED')}>
                  Completar
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
