import { Trash2, ExternalLink, Music, Video } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { mediaService } from '../../services/media.service';
import Spinner from '../ui/Spinner';

export default function MediaList({ items, loading, onDeleted }) {
  const { success, error } = useToast();

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este contenido?')) return;
    try {
      await mediaService.remove(id);
      success('Contenido eliminado');
      onDeleted?.();
    } catch (err) {
      error(err.message);
    }
  };

  if (loading) return <Spinner className="py-8" />;

  if (items.length === 0) {
    return <p className="text-center text-gray-500 py-8">No hay contenido registrado.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            item.type === 'SPOTIFY' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {item.type === 'SPOTIFY' ? <Music className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">{item.title}</p>
            <p className="text-xs text-gray-500 truncate">{item.url}</p>
          </div>

          {item.category && (
            <span className="hidden sm:inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {item.category}
            </span>
          )}

          <div className="flex items-center gap-2">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
            <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
