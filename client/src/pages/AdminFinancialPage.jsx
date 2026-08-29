import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, BookOpen, Calendar, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { dashboardService } from '../services/dashboard.service';
import { formatDate } from '../utils/formatDate';
import Spinner from '../components/ui/Spinner';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function AdminFinancialPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadData();
  }, [year]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getFinancial(year);
      setData(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <Spinner className="py-20" />;
  if (!data) return <p className="text-center py-20 text-gray-500">Error al cargar datos financieros</p>;

  const maxRevenue = Math.max(...data.monthlyRevenue.map((m) => m.total), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Financiero</h1>
          <p className="text-sm text-gray-500">Resumen de ingresos y ventas</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setYear(year - 1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-gray-900 min-w-[60px] text-center">{year}</span>
          <button onClick={() => setYear(year + 1)} className="p-2 hover:bg-gray-100 rounded-lg" disabled={year >= new Date().getFullYear()}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total del Año"
          value={`$${data.yearTotal.toLocaleString('es-MX')}`}
          icon={DollarSign}
          color="purple"
        />
        <KPICard
          title="Ingresos Libros"
          value={`$${data.monthlyRevenue.reduce((s, m) => s + m.books, 0).toLocaleString('es-MX')}`}
          icon={BookOpen}
          color="blue"
        />
        <KPICard
          title="Ingresos Sesiones"
          value={`$${data.monthlyRevenue.reduce((s, m) => s + m.sessions, 0).toLocaleString('es-MX')}`}
          icon={Calendar}
          color="green"
        />
        <KPICard
          title="Mes Más Alto"
          value={`$${Math.max(...data.monthlyRevenue.map((m) => m.total)).toLocaleString('es-MX')}`}
          subtitle={MONTHS[data.monthlyRevenue.indexOf(data.monthlyRevenue.reduce((max, m) => m.total > max.total ? m : max, data.monthlyRevenue[0]))]}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Chart - Bar Graph */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Ingresos Mensuales {year}</h2>
        <div className="flex items-end gap-2 h-64">
          {data.monthlyRevenue.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end h-48">
                <span className="text-[10px] text-gray-500 mb-1">
                  {m.total > 0 ? `$${(m.total / 1000).toFixed(1)}k` : ''}
                </span>
                <div className="w-full flex flex-col gap-0.5" style={{ height: `${(m.total / maxRevenue) * 100}%`, minHeight: m.total > 0 ? '4px' : '0' }}>
                  {m.sessions > 0 && (
                    <div
                      className="w-full bg-green-400 rounded-t"
                      style={{ flex: m.sessions / m.total }}
                    />
                  )}
                  {m.books > 0 && (
                    <div
                      className="w-full bg-blue-400 rounded-b"
                      style={{ flex: m.books / m.total }}
                    />
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-1">{MONTHS[i]}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400" /> Sesiones</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400" /> Libros</span>
        </div>
      </div>

      {/* Ingresos por método de pago */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Método de Pago ({year})</h2>
        {!data.byMethod || data.byMethod.length === 0 ? (
          <p className="text-sm text-gray-500">Sin pagos verificados este año.</p>
        ) : (
          <div className="space-y-3">
            {data.byMethod.map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm font-medium text-gray-900">{METHOD_LABELS[m.method] || m.method}</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">${(m._sum.amount || 0).toLocaleString('es-MX')}</span>
                  <span className="text-xs text-gray-400 ml-2">({m._count} pagos)</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50">
          Los ingresos se calculan a partir de los pagos verificados registrados en el sistema.
        </p>
      </div>

      {/* Top Books */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Libros Más Vendidos</h2>
        {data.topBooks.length === 0 ? (
          <p className="text-sm text-gray-500">Sin ventas registradas</p>
        ) : (
          <div className="space-y-3">
            {data.topBooks.map((book, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="text-sm font-medium text-gray-900">{book.title}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{book._sum.quantity} vendidos</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const METHOD_LABELS = {
  PAYPAL: 'PayPal',
  TRANSFER: 'Transferencia bancaria',
  CASH: 'Efectivo',
  OTHER: 'Otro',
};

function KPICard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
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
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
