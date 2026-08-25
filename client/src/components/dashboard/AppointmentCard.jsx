import { Calendar, Clock, User, XCircle } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatDate';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function AppointmentCard({ appointment, onCancel }) {
  const canCancel = appointment.status === 'PENDING' || appointment.status === 'CONFIRMED';

  return (
    <Card>
      <Card.Body className="p-5">
        <div className="flex items-start justify-between mb-3">
          <Badge status={appointment.status} />
          {canCancel && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Cancelar cita"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <User className="w-4 h-4 text-primary-500" />
            <span>{appointment.partnerName}</span>
          </div>
        </div>

        {appointment.reason && (
          <p className="mt-3 text-sm text-gray-500 border-t border-gray-100 pt-3">
            {appointment.reason}
          </p>
        )}

        {appointment.zoomUrl && appointment.status === 'CONFIRMED' && (
          <a
            href={appointment.zoomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors border-t border-gray-100"
          >
            📹 Unirse a sesión Zoom
          </a>
        )}
      </Card.Body>
    </Card>
  );
}
