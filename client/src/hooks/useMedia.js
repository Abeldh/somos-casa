import { useState, useEffect, useCallback } from 'react';
import { mediaService } from '../services/media.service';

export function useMedia(type, activeOnly = true) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMedia = useCallback(async () => {
    if (!type) return;
    setLoading(true);
    try {
      const data = activeOnly
        ? await mediaService.getActive(type)
        : await mediaService.getAll(type);
      setItems(data.media || []);
    } catch (err) {
      console.error('Error fetching media:', err.message);
    } finally {
      setLoading(false);
    }
  }, [type, activeOnly]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { items, loading, fetchMedia };
}
