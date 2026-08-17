import { Users, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function AdminStats({ appointments }) {
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === 'PENDING').length;
  const confirmed = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const completed = appointments.filter((a) => a.status === 'COMPLETED').length;

  const stats = [
    { label: 'Total Citas', value: total, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pendientes', value: pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Confirmadas', value: confirmed, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Completadas', value: completed, icon: Users, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
