import { useEffect, useState } from 'react';
import { Users, Calendar, ShoppingBag, DollarSign, TrendingUp, TrendingDown, BookOpen, UserPlus } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { useToast } from '../hooks/useToast';
import { appointmentService } from '../services/appointment.service';
import { dashboardService } from '../services/dashboard.service';
import AdminStats from '../components/admin/AdminStats';
import AppointmentsTable from '../components/admin/AppointmentsTable';
import Spinner from '../components/ui/Spinner';

export default function AdminDashboardPage() {
  const { appointments, loading, fetchAll } = useAppointments(false);
  const { success, error } = useToast();
  const [metrics, setMetrics] = useState(null);
  const [activity, setActivity] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    fetchAll();
    loadMetrics();
  }, [fetchAll]);

  const loadMetrics = async () => {
    try {
      const [metricsRes, activityRes] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getRecentActivity(5),
      ]);
      setMetrics(metricsRes.data);
      setActivity(activityRes.data);
    } catch (e) { console.error(e); }
    finally { setMetricsLoading(false); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      success('Estado actualizado');
      fetchAll();
    } catch (err) {
      error(err.message);
    }
  };

  const getGrowth = (current, previous) => {
    if (!previous) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen general de la plataforma.</p>
      </div>

      {/* Métricas mejoradas */}
      {metricsLoading ? (
        <Spinner className="py-8" />
      ) : metrics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Usuarios"
            value={metrics.users.total}
            change={getGrowth(metrics.users.thisMonth, metrics.users.lastMonth)}
            subtitle={`+${metrics.users.thisMonth} este mes`}
            icon={Users}
            color="blue"
          />
          <MetricCard
            title="Citas del Mes"
            value={metrics.appointments.thisMonth}
            change={getGrowth(metrics.appointments.thisMonth, metrics.appointments.lastMonth)}
            subtitle={`${metrics.appointments.cancellationRate}% cancelación`}
            icon={Calendar}
            color="purple"
          />
          <MetricCard
            title="Ingresos del Mes"
            value={`$${metrics.revenue.thisMonth.toLocaleString('es-MX')}`}
            change={getGrowth(metrics.revenue.thisMonth, metrics.revenue.lastMonth)}
            subtitle="vs mes anterior"
            icon={DollarSign}
            color="green"
          />
          <MetricCard
            title="Pedidos del Mes"
            value={metrics.orders.thisMonth}
            subtitle={`${metrics.books.active} libros activos`}
            icon={ShoppingBag}
            color="amber"
          />
        </div>
      ) : (
        <AdminStats appointments={appointments} />
      )}

      {/* Actividad reciente */}
      {activity && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-500" /> Usuarios nuevos
            </h3>
            <div className="space-y-2">
              {activity.recentUsers.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{u.firstName} {u.lastName}</span>
                  <span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString('es-MX')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-green-500" /> Pedidos recientes
            </h3>
            <div className="space-y-2">
              {activity.recentOrders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <span className="text-sm text-gray-700">{o.user.firstName} {o.user.lastName}</span>
                    <span className="text-xs text-gray-400 ml-2">#{o.orderNumber}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">${o.total}</span>
                </div>
              ))}
              {activity.recentOrders.length === 0 && <p className="text-xs text-gray-400">Sin pedidos recientes</p>}
            </div>
          </div>
        </div>
      )}

      {/* Tabla de citas */}
      <div>
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

function MetricCard({ title, value, change, subtitle, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{title}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="flex items-center gap-2 mt-1">
        {change !== undefined && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
    </div>
  );
}
