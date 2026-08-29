import { Headphones } from 'lucide-react';
import { useMedia } from '../../hooks/useMedia';
import SpotifyCard from './SpotifyCard';
import Spinner from '../ui/Spinner';

export default function SpotifySection() {
  const { items, loading } = useMedia('SPOTIFY');

  return (
    <section id="spotify-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Headphones className="w-4 h-4" />
            Podcast
          </div>
          <h2 className="section-title">Escucha nuestro podcast</h2>
          <p className="section-subtitle mx-auto">
            Episodios con enseñanza bíblica sobre el matrimonio, la comunicación, el perdón y la vida en familia bajo el señorío de Cristo.
          </p>
        </div>

        {loading ? (
          <Spinner className="py-12" />
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Pronto tendremos contenido disponible.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <SpotifyCard key={item.id} media={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
