import { useState, useEffect } from 'react';
import { HandHeart, Plus, Clock, CheckCircle, Lock, Globe } from 'lucide-react';
import { prayerService } from '../../services/prayer.service';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';

export default function PrayerSection() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', request: '', isPrivate: true });

  const load = async () => {
    setLoading(true);
    try {
      const res = await prayerService.getMine();
      setPrayers(res.prayers || []);
    } catch (e) { /* silencioso */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openForm = () => {
    setForm({ name: user ? `${user.firstName} ${user.lastName}` : '', request: '', isPrivate: true });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.request) { error('Escribe tu nombre y tu petición.'); return; }
    setSending(true);
    try {
      await prayerService.create(form);
      success('Tu petición fue recibida. Oraremos por ti.');
      setShowForm(false);
      load();
    } catch (err) { error(err.message); }
    finally { setSending(false); }
  };

  const statusBadge = (status) => {
    if (status === 'PRAYED') return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" /> Orada</span>;
    if (status === 'ARCHIVED') return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Archivada</span>;
    return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"><Clock className="w-3 h-3" /> Recibida</span>;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <HandHeart className="w-5 h-5 text-primary-600" />
            Peticiones de Oración
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Comparte tu petición y nuestro equipo pastoral orará por ti.
          </p>
        </div>
        <Button onClick={openForm} className="flex items-center gap-2 flex-shrink-0">
          <Plus className="w-4 h-4" /> Pedir oración
        </Button>
      </div>

      {loading ? (
        <Spinner className="py-8" />
      ) : prayers.length === 0 ? (
        <div className="text-center py-8 bg-warm-50 rounded-lg">
          <HandHeart className="w-10 h-10 text-primary-200 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Aún no has enviado peticiones. Estamos para orar contigo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prayers.map((p) => (
            <div key={p.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-gray-700 whitespace-pre-wrap flex-1">{p.request}</p>
                {statusBadge(p.status)}
              </div>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  {p.isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                  {p.isPrivate ? 'Privada' : 'Pública'}
                </span>
                <span>{new Date(p.createdAt).toLocaleDateString('es-MX')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Comparte tu petición de oración">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-3">
            <p className="text-xs text-primary-700 italic">
              "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración." — Filipenses 4:6
            </p>
          </div>

          <Input
            label="Tu nombre"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="¿Cómo te llamas?"
          />

          <Textarea
            label="Tu petición"
            value={form.request}
            onChange={(e) => setForm((f) => ({ ...f, request: e.target.value }))}
            placeholder="Cuéntanos por qué necesitas oración..."
            rows={4}
          />

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isPrivate}
              onChange={(e) => setForm((f) => ({ ...f, isPrivate: e.target.checked }))}
              className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>
              Mantener mi petición <strong>privada</strong> (solo la verá el equipo pastoral).
              Desmárcala si deseas que también aparezca en el muro público de oración.
            </span>
          </label>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" loading={sending} className="flex-1">Enviar petición</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
