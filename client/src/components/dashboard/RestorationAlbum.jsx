import { useState, useEffect } from 'react';
import { HeartHandshake, Clock, CheckCircle, Plus } from 'lucide-react';
import { albumService } from '../../services/album.service';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import ImageUpload from '../ui/ImageUpload';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';

export default function RestorationAlbum() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ coupleName: '', message: '', photoUrl: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await albumService.getMine();
      setPhotos(res.photos || []);
    } catch (e) { /* silencioso */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openForm = () => {
    setForm({
      coupleName: user ? `${user.firstName} ${user.lastName}` : '',
      message: '',
      photoUrl: '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.coupleName || !form.message || !form.photoUrl) {
      error('Agrega el nombre, tu mensaje y una foto.');
      return;
    }
    setSending(true);
    try {
      await albumService.create(form);
      success('¡Gloria a Dios! Tu foto fue enviada y será revisada antes de publicarse.');
      setShowForm(false);
      load();
    } catch (err) { error(err.message); }
    finally { setSending(false); }
  };

  const statusBadge = (isApproved) =>
    isApproved ? (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
        <CheckCircle className="w-3 h-3" /> Publicada
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
        <Clock className="w-3 h-3" /> En revisión
      </span>
    );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-primary-600" />
            Álbum de Restauración
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            ¿Dios restauró tu matrimonio? Comparte una foto con tu pareja y da testimonio de su gracia.
          </p>
        </div>
        <Button onClick={openForm} className="flex items-center gap-2 flex-shrink-0">
          <Plus className="w-4 h-4" />
          Subir foto
        </Button>
      </div>

      {loading ? (
        <Spinner className="py-8" />
      ) : photos.length === 0 ? (
        <div className="text-center py-8 bg-warm-50 rounded-lg">
          <HeartHandshake className="w-10 h-10 text-primary-200 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Aún no has compartido tu testimonio de restauración.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((p) => (
            <div key={p.id} className="rounded-xl overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gray-100">
                <img src={p.photoUrl} alt={p.coupleName} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.coupleName}</p>
                  {statusBadge(p.isApproved)}
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">"{p.message}"</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para subir */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Comparte tu testimonio de restauración">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-3">
            <p className="text-xs text-primary-700 italic">
              "Este es el día que hizo Jehová; nos gozaremos y alegraremos en él." — Salmo 118:24
            </p>
          </div>

          <ImageUpload
            label="Foto con tu pareja"
            value={form.photoUrl}
            onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))}
          />

          <Input
            label="Nombre de la pareja"
            value={form.coupleName}
            onChange={(e) => setForm((f) => ({ ...f, coupleName: e.target.value }))}
            placeholder="Ej: Juan y María"
          />

          <Textarea
            label="Tu mensaje de testimonio"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Cuéntanos brevemente cómo Dios ha obrado en tu matrimonio..."
            rows={4}
          />

          <p className="text-xs text-gray-500">
            Tu foto será revisada por el administrador. Solo se publicarán las que sean aprobadas.
          </p>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={sending} className="flex-1">
              Enviar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
