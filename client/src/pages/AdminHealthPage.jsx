import { useState, useEffect } from 'react';
import { Activity, Database, Mail, Server, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { dashboardService } from '../services/dashboard.service';
import Spinner from '../components/ui/Spinner';

export default function AdminHealthPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await dashboardService.getSystemHealth();
      setData(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Spinner className="py-20" />;
  if (!data) return <p className="text-center py-20 text-gray-500">No se pudo cargar el estado del sistema.</p>;

  const dbOk = data.db.status === 'ok';
  const emailOk = data.email.configured;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salud del Sistema</h1>
          <p className="text-sm text-gray-500">Estado general de la plataforma</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Estado de servicios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusCard
          icon={Database}
          title="Base de Datos"
          ok={dbOk}
          detail={dbOk ? `Latencia: ${data.db.latencyMs} ms` : (data.db.message || 'Sin conexión')}
        />
        <StatusCard
          icon={Mail}
          title="Correo (Resend)"
          ok={emailOk}
          detail={emailOk ? 'Configurado y activo' : 'No configurado'}
        />
        <StatusCard
          icon={Server}
          title="Servidor"
          ok={true}
          detail={`Activo · ${data.server.uptimeHuman}`}
        />
      </div>

      {/* Detalle del servidor */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-primary-600" /> Servidor
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <Metric label="Tiempo activo" value={data.server.uptimeHuman} />
          <Metric label="Memoria en uso" value={`${data.server.memoryMB} MB`} />
          <Metric label="Memoria total" value={`${data.server.memoryTotalMB} MB`} />
          <Metric label="Entorno" value={data.server.nodeEnv} />
          <Metric label="Node.js" value={data.server.nodeVersion} />
          <Metric label="Última revisión" value={new Date(data.checkedAt).toLocaleString('es-MX')} />
        </div>
      </div>

      {/* Conteos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-600" /> Registros en la base de datos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <CountCard label="Usuarios" value={data.counts.users} />
          <CountCard label="Citas" value={data.counts.appointments} />
          <CountCard label="Pedidos" value={data.counts.orders} />
          <CountCard label="Pagos" value={data.counts.payments} />
          <CountCard label="Libros" value={data.counts.books} />
          <CountCard label="Pagos pendientes" value={data.counts.pendingPayments} highlight={data.counts.pendingPayments > 0} />
        </div>
      </div>

      {/* Errores recientes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Eventos de seguridad recientes
        </h2>
        {data.recentErrors.length === 0 ? (
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" /> Sin eventos de error registrados.
          </p>
        ) : (
          <div className="space-y-2">
            {data.recentErrors.map((e) => (
              <div key={e.id} className="flex items-start justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{e.event.replace(/_/g, ' ')}</p>
                  {e.detail && <p className="text-xs text-gray-500">{e.detail}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-gray-400">{new Date(e.createdAt).toLocaleString('es-MX')}</p>
                  {e.ip && <p className="text-[10px] text-gray-400">{e.ip}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, title, ok, detail }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
        {ok ? (
          <span className="flex items-center gap-1 text-xs font-medium text-green-600"><CheckCircle className="w-4 h-4" /> Operativo</span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-medium text-red-500"><XCircle className="w-4 h-4" /> Con problemas</span>
        )}
      </div>
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{detail}</p>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function CountCard({ label, value, highlight }) {
  return (
    <div className={`rounded-lg p-3 text-center ${highlight ? 'bg-amber-50' : 'bg-gray-50'}`}>
      <p className={`text-xl font-bold ${highlight ? 'text-amber-600' : 'text-gray-900'}`}>{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
