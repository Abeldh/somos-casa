import { extractSpotifyId } from '../../utils/helpers';
import Card from '../ui/Card';

export default function SpotifyCard({ media }) {
  const episodeId = extractSpotifyId(media.url);

  return (
    <Card className="group">
      <Card.Body className="p-0">
        {episodeId ? (
          <iframe
            src={`https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0`}
            width="100%"
            height="232"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-t-xl"
            title={media.title}
          />
        ) : (
          <div className="h-[232px] bg-gray-100 flex items-center justify-center rounded-t-xl">
            <p className="text-gray-400 text-sm">Reproductor no disponible</p>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{media.title}</h3>
          {media.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{media.description}</p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
