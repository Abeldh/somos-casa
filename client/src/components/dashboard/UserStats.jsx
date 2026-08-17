import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function UserStats({ appointments }) {
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === 'PENDING').length;
  const confirmed = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const completed = appointments.filter((a) => a.status === 'COMPLETED').length;

  const stats = [
    { label: 'Total', value: total, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pendientes', value: pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Confirmadas', value: confirmed, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Completadas', value: completed, icon: CheckCircle, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
