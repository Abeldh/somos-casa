import { useState, useEffect, useCallback } from 'react';
import { mediaService } from '../services/media.service';
import { useToast } from './useToast';

export function useMedia(type, activeOnly = true) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error: showError } = useToast();

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const data = activeOnly
        ? await mediaService.getActive(type)
        : await mediaService.getAll(type);
      setItems(data.media || []);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, [type, activeOnly, showError]);

  useEffect(() => {
    if (type) fetchMedia();
  }, [type, fetchMedia]);

  return { items, loading, fetchMedia };
}
