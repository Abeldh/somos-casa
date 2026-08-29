import { useState, useEffect } from 'react';
import { Images, Check, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { albumService } from '../services/album.service';
import Spinner from '../components/ui/Spinner';

export default function AdminAlbumPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await albumService.getAll();
      setPhotos(res.photos || []);
    } catch (e) { error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (id) => {
    try { await albumService.toggleApproval(id); success('Estado actualizado'); load(); }
    catch (e) { error(e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta foto del álbum?')) return;
    try { await albumService.remove(id); success('Foto eliminada'); load(); }
    catch (e) { error(e.message); }
  };

  const pending = photos.filter((p) => !p.isApproved);
  const approved = photos.filter((p) => p.isApproved);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Álbum de Restauración</h1>
        <p className="text-gray-500 mt-1">Aprueba las fotos que se mostrarán en la página principal.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{photos.length}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
          <p className="text-xs text-gray-500">Pendientes</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{approved.length}</p>
          <p className="text-xs text-gray-500">Publicadas</p>
        </div>
      </div>

      {loading ? <Spinner className="py-12" /> : photos.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Aún no hay fotos en el álbum.</p>
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Images className="w-4 h-4 text-amber-600" />
                Pendientes de aprobación ({pending.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pending.map((p) => (
                  <PhotoCard key={p.id} photo={p} onToggle={handleToggle} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Publicadas en la página ({approved.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {approved.map((p) => (
                  <PhotoCard key={p.id} photo={p} onToggle={handleToggle} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PhotoCard({ photo: p, onToggle, onDelete }) {
  return (
    <div className={`bg-white rounded-xl border overflow-hidden ${p.isApproved ? 'border-green-200' : 'border-amber-200'}`}>
      <div className="aspect-square bg-gray-100 relative">
        <img src={p.photoUrl} alt={p.coupleName} className="w-full h-full object-cover" />
        <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${p.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {p.isApproved ? 'Publicada' : 'Pendiente'}
        </span>
      </div>
      <div className="p-4">
        <p className="font-semibold text-gray-900 text-sm">{p.coupleName}</p>
        <p className="text-sm text-gray-600 leading-relaxed mt-1">"{p.message}"</p>
        {p.user && (
          <p className="text-xs text-gray-400 mt-2">
            {p.user.firstName} {p.user.lastName} · {p.user.email}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
          <button
            onClick={() => onToggle(p.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${p.isApproved ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
          >
            {p.isApproved ? <><EyeOff className="w-4 h-4" /> Ocultar</> : <><Eye className="w-4 h-4" /> Publicar</>}
          </button>
          <button
            onClick={() => onDelete(p.id)}
            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
