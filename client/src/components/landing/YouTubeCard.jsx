import { useState } from 'react';
import { Play } from 'lucide-react';
import { extractYouTubeId } from '../../utils/helpers';
import Card from '../ui/Card';

export default function YouTubeCard({ media }) {
  const [playing, setPlaying] = useState(false);
  const videoId = extractYouTubeId(media.url);

  return (
    <Card className="group">
      <Card.Body className="p-0">
        {playing && videoId ? (
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-t-xl"
              title={media.title}
            />
          </div>
        ) : (
          <div
            className="aspect-video relative cursor-pointer bg-gray-900 rounded-t-xl overflow-hidden"
            onClick={() => setPlaying(true)}
          >
            <img
              src={media.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={media.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white ml-1" fill="white" />
              </div>
            </div>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{media.title}</h3>
          {media.category && (
            <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {media.category}
            </span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
