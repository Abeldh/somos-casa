import { useState, useEffect } from 'react';
import { Package, CheckCircle, Clock, DollarSign, User, Calendar, BookOpen } from 'lucide-react';
import { orderService } from '../services/order.service';
import { useToast } from '../hooks/useToast';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'PAID', label: 'Pagados' },
  { value: 'CANCELLED', label: 'Cancelados' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { success, error } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll({ status: filter || undefined });
      setOrders(data.orders || []);
    } catch (e) { error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleConfirmPayment = async (orderId) => {
    if (!confirm('¿Confirmar pago? Esto liberará los libros para descarga y enviará un email al usuario.')) return;
    try {
      await orderService.confirmPayment(orderId);
      success('Pago confirmado. Libro liberado para descarga.');
      fetchOrders();
    } catch (e) { error(e.message); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Pedidos de Libros</h1>
          <p className="text-gray-500 mt-1">Verifica pagos y libera descargas.</p>
        </div>
        <div className="mt-4 sm:mt-0 w-48">
          <Select options={statusOptions} value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={orders.length} icon={Package} color="bg-blue-50 text-blue-600" />
        <StatCard label="Pendientes" value={orders.filter(o => o.status === 'PENDING').length} icon={Clock} color="bg-yellow-50 text-yellow-600" />
        <StatCard label="Pagados" value={orders.filter(o => o.status === 'PAID').length} icon={CheckCircle} color="bg-green-50 text-green-600" />
        <StatCard label="Ingresos" value={`$${orders.filter(o => o.status === 'PAID').reduce((s, o) => s + o.total, 0).toFixed(0)}`} icon={DollarSign} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Orders list */}
      {loading ? <Spinner className="py-12" /> : orders.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No hay pedidos.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <Badge status={order.status} />
                  <span className="text-sm font-mono text-gray-500">{order.orderNumber}</span>
                </div>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(order.createdAt)}
                </span>
              </div>

              {/* Cliente */}
              <div className="flex items-center gap-2 mb-3 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">{order.user?.firstName} {order.user?.lastName}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{order.user?.email}</span>
                {order.user?.phone && <><span className="text-gray-400">•</span><span className="text-gray-500">{order.user.phone}</span></>}
              </div>

              {/* Libros */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Libros ({order.items?.length})
                </p>
                <div className="space-y-1.5">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">{item.title}</span>
                        <span className="text-xs text-gray-400">×{item.quantity}</span>
                        {item.book?.pdfUrl ? (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">PDF ✓</span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Sin PDF</span>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer: total + acciones */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <span className="text-sm text-gray-500">Total: </span>
                  <span className="text-lg font-bold text-primary-700">${order.total.toFixed(2)}</span>
                </div>

                {order.status === 'PENDING' && (
                  <Button
                    onClick={() => handleConfirmPayment(order.id)}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirmar Pago
                  </Button>
                )}

                {order.status === 'PAID' && (
                  <span className="flex items-center gap-1.5 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    Pagado — Libro liberado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
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
