import { useState, useEffect } from 'react';
import { Plus, Tag, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { couponService } from '../services/coupon.service';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(getEmptyForm());
  const { success, error } = useToast();

  function getEmptyForm() {
    return { code: '', type: 'PERCENTAGE', value: '', appliesTo: 'ALL', minPurchase: '', maxDiscount: '', maxUses: '', startsAt: '', expiresAt: '' };
  }

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await couponService.getAll();
      setCoupons(res.data.coupons);
    } catch (e) { error('Error al cargar cupones'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        value: Number(form.value),
        minPurchase: form.minPurchase ? Number(form.minPurchase) : null,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        startsAt: form.startsAt || null,
        expiresAt: form.expiresAt || null,
      };
      if (editing) {
        await couponService.update(editing.id, data);
        success('Cupón actualizado');
      } else {
        await couponService.create(data);
        success('Cupón creado');
      }
      setShowModal(false);
      setEditing(null);
      setForm(getEmptyForm());
      loadCoupons();
    } catch (e) { error(e.response?.data?.message || 'Error'); }
  };

  const handleEdit = (coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      appliesTo: coupon.appliesTo,
      minPurchase: coupon.minPurchase?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      maxUses: coupon.maxUses?.toString() || '',
      startsAt: coupon.startsAt ? coupon.startsAt.split('T')[0] : '',
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleToggle = async (coupon) => {
    try {
      await couponService.update(coupon.id, { isActive: !coupon.isActive });
      loadCoupons();
    } catch (e) { error('Error al cambiar estado'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este cupón?')) return;
    try {
      await couponService.delete(id);
      success('Cupón eliminado');
      loadCoupons();
    } catch (e) { error('Error al eliminar'); }
  };

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cupones y Descuentos</h1>
          <p className="text-sm text-gray-500">{coupons.length} cupones registrados</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(getEmptyForm()); setShowModal(true); }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Cupón
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Valor</th>
                <th className="px-4 py-3 text-left">Aplica a</th>
                <th className="px-4 py-3 text-left">Usos</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Expira</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-primary-700">{c.code}</td>
                  <td className="px-4 py-3">{c.type === 'PERCENTAGE' ? 'Porcentaje' : 'Monto fijo'}</td>
                  <td className="px-4 py-3 font-semibold">{c.type === 'PERCENTAGE' ? `${c.value}%` : `$${c.value}`}</td>
                  <td className="px-4 py-3 text-gray-500">{c.appliesTo === 'ALL' ? 'Todo' : c.appliesTo === 'BOOKS' ? 'Libros' : 'Sesiones'}</td>
                  <td className="px-4 py-3">{c.usedCount}{c.maxUses ? `/${c.maxUses}` : ''}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('es-MX') : 'Sin límite'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleToggle(c)} className="p-1.5 hover:bg-gray-100 rounded" title={c.isActive ? 'Desactivar' : 'Activar'}>
                        {c.isActive ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                      </button>
                      <button onClick={() => handleEdit(c)} className="p-1.5 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-500" /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {coupons.map((c) => (
            <div key={c.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-primary-700">{c.code}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {c.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{c.type === 'PERCENTAGE' ? `${c.value}%` : `$${c.value}`} — {c.appliesTo === 'ALL' ? 'Todo' : c.appliesTo}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(c)} className="text-xs text-gray-500 hover:text-primary-600">{c.isActive ? 'Desactivar' : 'Activar'}</button>
                <button onClick={() => handleEdit(c)} className="text-xs text-gray-500 hover:text-primary-600">Editar</button>
                <button onClick={() => handleDelete(c.id)} className="text-xs text-red-400 hover:text-red-600">Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        {coupons.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No hay cupones creados</p>}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title={editing ? 'Editar Cupón' : 'Nuevo Cupón'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Código" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="VERANO2025" required />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Tipo" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="PERCENTAGE">Porcentaje</option>
                <option value="FIXED_AMOUNT">Monto fijo</option>
              </Select>
              <Input label={form.type === 'PERCENTAGE' ? 'Valor (%)' : 'Valor ($)'} type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
            </div>
            <Select label="Aplica a" value={form.appliesTo} onChange={(e) => setForm({ ...form, appliesTo: e.target.value })}>
              <option value="ALL">Todo</option>
              <option value="BOOKS">Solo libros</option>
              <option value="SESSIONS">Solo sesiones</option>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Compra mínima" type="number" value={form.minPurchase} onChange={(e) => setForm({ ...form, minPurchase: e.target.value })} placeholder="Opcional" />
              <Input label="Descuento máximo" type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} placeholder="Opcional" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Máximo usos" type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Ilimitado" />
              <Input label="Fecha expiración" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
              <Button type="submit" className="flex-1">{editing ? 'Guardar' : 'Crear Cupón'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
