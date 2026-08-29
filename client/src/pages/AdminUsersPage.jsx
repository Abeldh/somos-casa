import { useState, useEffect } from 'react';
import { Users, Eye, Shield, ShieldOff, ChevronRight, Calendar, ShoppingBag, Clock, Activity, User, Mail, Phone } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';
import api from '../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activity, setActivity] = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const { success, error } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/users', { params: { page, limit } });
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    }
    catch (e) { error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, limit]);
  const changeLimit = (l) => { setLimit(l); setPage(1); };

  const viewActivity = async (user) => {
    setSelectedUser(user);
    setActivityLoading(true);
    try {
      const data = await api.get(`/users/${user.id}/activity`);
      setActivity(data);
    } catch (e) { error(e.message); }
    finally { setActivityLoading(false); }
  };

  const toggleActive = async (id) => {
    try { await api.patch(`/users/${id}/toggle-active`); success('Estado actualizado'); fetchUsers(); }
    catch (e) { error(e.message); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const shortDate = (d) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-500 mt-1">Gestiona usuarios y revisa su actividad.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={total} icon={Users} color="bg-blue-50 text-blue-600" />
        <StatCard label="Activos (página)" value={users.filter(u => u.isActive).length} icon={Shield} color="bg-green-50 text-green-600" />
        <StatCard label="Admins (página)" value={users.filter(u => u.role === 'ADMIN').length} icon={Activity} color="bg-purple-50 text-purple-600" />
        <StatCard label="Inactivos (página)" value={users.filter(u => !u.isActive).length} icon={ShieldOff} color="bg-red-50 text-red-600" />
      </div>

      {/* Users table */}
      {loading ? <Spinner className="py-12" /> : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${!u.isActive ? 'opacity-60 border-red-200' : 'border-gray-200'}`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'}`}>
                {u.firstName?.[0]}{u.lastName?.[0]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{u.firstName} {u.lastName}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>

              {/* Role badge */}
              <span className={`hidden sm:inline-block text-xs px-2 py-1 rounded-full font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                {u.role}
              </span>

              {/* Orders count */}
              {u._count && (
                <span className="hidden md:inline-block text-xs text-gray-500">
                  {u._count.orders} pedido{u._count.orders !== 1 ? 's' : ''}
                </span>
              )}

              {/* Registered date */}
              <span className="hidden lg:inline-block text-xs text-gray-400">{shortDate(u.createdAt)}</span>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button onClick={() => viewActivity(u)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Ver actividad">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => toggleActive(u.id)} className={`${u.isActive ? 'text-green-500 hover:text-red-500' : 'text-red-400 hover:text-green-500'} transition-colors`} title={u.isActive ? 'Desactivar' : 'Activar'}>
                  {u.isActive ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && users.length > 0 && (
        <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} onLimitChange={changeLimit} />
      )}

      {/* Activity Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => { setSelectedUser(null); setActivity(null); }} title={`Actividad de ${selectedUser?.firstName || ''} ${selectedUser?.lastName || ''}`}>
        {activityLoading ? <Spinner className="py-8" /> : activity ? (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* User info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400" /><span>{selectedUser.email}</span></div>
              {selectedUser.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" /><span>{selectedUser.phone}</span></div>}
              <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-gray-400" /><span>Registrado: {formatDate(selectedUser.createdAt)}</span></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-700">{activity.stats.totalOrders}</p>
                <p className="text-xs text-blue-600">Pedidos</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-700">${activity.stats.totalSpent.toFixed(0)}</p>
                <p className="text-xs text-green-600">Gastado</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-purple-700">{activity.stats.totalAppointments}</p>
                <p className="text-xs text-purple-600">Citas</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-amber-700">{activity.stats.activeSessions}</p>
                <p className="text-xs text-amber-600">Sesiones activas</p>
              </div>
            </div>

            {/* Compras */}
            {activity.orders.length > 0 && (
              <Section title="Compras" icon={ShoppingBag}>
                {activity.orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{o.orderNumber}</p>
                      <p className="text-xs text-gray-500">{o.items.map(i => i.book?.title || i.title).join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">${o.total.toFixed(2)}</p>
                      <Badge status={o.status} className="text-[10px]" />
                    </div>
                  </div>
                ))}
              </Section>
            )}

            {/* Citas */}
            {activity.appointments.length > 0 && (
              <Section title="Citas" icon={Calendar}>
                {activity.appointments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm text-gray-800">{shortDate(a.date)} • {a.startTime}-{a.endTime}</p>
                      <p className="text-xs text-gray-500">{a.partnerName}</p>
                    </div>
                    <Badge status={a.status} className="text-[10px]" />
                  </div>
                ))}
              </Section>
            )}

            {/* Audit logs */}
            {activity.auditLogs.length > 0 && (
              <Section title="Actividad de seguridad" icon={Activity}>
                {activity.auditLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-xs font-medium text-gray-800">{log.event.replace(/_/g, ' ')}</p>
                      {log.detail && <p className="text-xs text-gray-500 truncate max-w-[250px]">{log.detail}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-gray-400">{formatDate(log.createdAt)}</p>
                      {log.ip && <p className="text-[10px] text-gray-400">{log.ip}</p>}
                    </div>
                  </div>
                ))}
              </Section>
            )}

            {/* Sesiones activas */}
            {activity.activeSessions.length > 0 && (
              <Section title="Sesiones activas" icon={Clock}>
                {activity.activeSessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <p className="text-xs text-gray-600">Iniciada: {formatDate(s.createdAt)}</p>
                    <p className="text-xs text-gray-400">Expira: {shortDate(s.expiresAt)}</p>
                  </div>
                ))}
              </Section>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary-600" />{title}
      </h4>
      <div className="bg-white border border-gray-100 rounded-lg px-3">{children}</div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
