import { useState, useEffect } from 'react';
import { HeartHandshake } from 'lucide-react';
import { albumService } from '../../services/album.service';

export default function AlbumSection() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    albumService.getApproved()
      .then((data) => setPhotos(data.photos || []))
      .catch(() => {});
  }, []);

  // Si no hay fotos aprobadas, no renderizar la sección
  if (photos.length === 0) return null;

  return (
    <section className="py-20 bg-warm-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <HeartHandshake className="w-4 h-4" />
            Álbum de Restauración
          </div>
          <h2 className="section-title">Matrimonios que Dios ha restaurado</h2>
          <p className="section-subtitle mx-auto">
            Cada foto es un testimonio vivo de la gracia y el amor de Dios en los hogares.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {photos.map((p) => (
            <div key={p.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={p.photoUrl}
                  alt={p.coupleName}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 text-sm">{p.coupleName}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-3">"{p.message}"</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 italic mt-10 max-w-xl mx-auto">
          "De modo que si alguno está en Cristo, nueva criatura es." — 2 Corintios 5:17
        </p>
      </div>
    </section>
  );
}
