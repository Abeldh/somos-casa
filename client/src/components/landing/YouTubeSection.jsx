import { useState } from 'react';
import { Video } from 'lucide-react';
import { useMedia } from '../../hooks/useMedia';
import YouTubeCard from './YouTubeCard';
import Spinner from '../ui/Spinner';

export default function YouTubeSection() {
  const { items, loading } = useMedia('YOUTUBE');
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...new Set(items.map((i) => i.category).filter(Boolean))];
  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Video className="w-4 h-4" />
            Videos
          </div>
          <h2 className="section-title">Enseñanzas en video</h2>
          <p className="section-subtitle mx-auto">
            Prédicas y enseñanzas para edificar tu matrimonio conforme a la Palabra de Dios.
          </p>
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <Spinner className="py-12" />
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No hay videos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <YouTubeCard key={item.id} media={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
