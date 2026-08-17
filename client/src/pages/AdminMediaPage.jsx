import { useState } from 'react';
import { Film } from 'lucide-react';
import { useMedia } from '../hooks/useMedia';
import MediaForm from '../components/admin/MediaForm';
import MediaList from '../components/admin/MediaList';

export default function AdminMediaPage() {
  const [tab, setTab] = useState('SPOTIFY');
  const { items, loading, fetchMedia } = useMedia(tab, false);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Gestión de Multimedia</h1>
        <p className="text-gray-500 mt-1">Administra los podcasts y videos que se muestran en el sitio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <MediaForm onCreated={fetchMedia} />
        </div>

        <div className="lg:col-span-2">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab('SPOTIFY')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'SPOTIFY' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Spotify
            </button>
            <button
              onClick={() => setTab('YOUTUBE')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'YOUTUBE' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              YouTube
            </button>
          </div>

          <MediaList items={items} loading={loading} onDeleted={fetchMedia} />
        </div>
      </div>
    </div>
  );
}
