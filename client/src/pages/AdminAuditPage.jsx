import { useState, useEffect } from 'react';
import { Shield, Download, Monitor, Smartphone, Tablet, Filter, RefreshCw } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import api from '../services/api';

const eventOptions = [
  { value: '', label: 'Todos los eventos' },
  { value: 'LOGIN_SUCCESS', label: 'Login exitoso' },
  { value: 'LOGIN_FAILED', label: 'Login fallido' },
  { value: 'REGISTER', label: 'Registro' },
  { value: 'LOGOUT', label: 'Logout' },
  { value: 'TOKEN_REFRESH', label: 'Token refresh' },
  { value: 'TOKEN_REUSE_DETECTED', label: '🚨 Token reuse (robo)' },
  { value: 'MFA_ENABLED', label: 'MFA activado' },
  { value: 'MFA_FAILED', label: 'MFA fallido' },
  { value: 'PASSWORD_CHANGED', label: 'Cambio contraseña' },
  { value: 'ORDER_STATUS_CHANGED', label: 'Orden actualizada' },
];

const DeviceIcon = ({ type }) => {
  if (type === 'Móvil') return <Smartphone className="w-3.5 h-3.5 text-blue-500" />;
  if (type === 'Tablet') return <Tablet className="w-3.5 h-3.5 text-purple-500" />;
  return <Monitor className="w-3.5 h-3.5 text-gray-500" />;
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ event: '', from: '', to: '' });
  const { error } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.event) params.event = filters.event;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      const data = await api.get('/audit', { params });
      setLogs(data.logs || []);
    } catch (e) { error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleFilter = () => fetchLogs();

  const handleExport = () => {
    const params = new URLSearchParams();
    if (filters.event) params.set('event', filters.event);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);
    const url = `${import.meta.env.VITE_API_URL || '/api'}/audit/export?${params.toString()}`;
    window.open(url, '_blank');
  };

  const formatDate = (d) => new Date(d).toLocaleString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const getEventColor = (event) => {
    if (event.includes('FAILED') || event.includes('REUSE')) return 'bg-red-100 text-red-700';
    if (event.includes('SUCCESS') || event.includes('ENABLED')) return 'bg-green-100 text-green-700';
    if (event.includes('REGISTER')) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Auditoría</h1>
          <p className="text-gray-500 mt-1">Registro de actividad y seguridad del sistema.</p>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Excel
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-48">
            <Select
              label="Evento"
              options={eventOptions}
              value={filters.event}
              onChange={(e) => setFilters((p) => ({ ...p, event: e.target.value }))}
            />
          </div>
          <div className="w-40">
            <Input
              label="Desde"
              type="date"
              value={filters.from}
              onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
            />
          </div>
          <div className="w-40">
            <Input
              label="Hasta"
              type="date"
              value={filters.to}
              onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
            />
          </div>
          <Button onClick={handleFilter} size="sm" className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            Filtrar
          </Button>
          <Button onClick={() => { setFilters({ event: '', from: '', to: '' }); fetchLogs(); }} variant="ghost" size="sm" className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5" />
            Limpiar
          </Button>
        </div>
      </div>

      {/* Tabla de logs */}
      {loading ? <Spinner className="py-12" /> : logs.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No hay registros de auditoría.</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{logs.length} registros</p>

          {/* Desktop */}
          <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Evento</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">IP</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Dispositivo</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Navegador</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">SO</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getEventColor(log.event)}`}>
                          {log.event.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-600">{log.ip || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <DeviceIcon type={log.deviceType} />
                          <span className="text-xs text-gray-600">{log.deviceType || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{log.browser || '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{log.os || '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate">{log.detail || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getEventColor(log.event)}`}>
                    {log.event.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(log.createdAt)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div><span className="text-gray-500">IP:</span> <span className="font-mono">{log.ip || '—'}</span></div>
                  <div className="flex items-center gap-1"><DeviceIcon type={log.deviceType} /><span>{log.deviceType || '—'}</span></div>
                  <div><span className="text-gray-500">Browser:</span> {log.browser || '—'}</div>
                  <div><span className="text-gray-500">OS:</span> {log.os || '—'}</div>
                </div>
                {log.detail && <p className="text-xs text-gray-500 mt-2 truncate">{log.detail}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
