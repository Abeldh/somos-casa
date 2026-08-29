import { useEffect } from 'react';

const BASE_TITLE = 'Somos Casa';

/**
 * Hook ligero para actualizar el título y la meta description por página,
 * sin dependencias externas. Restaura el título base al desmontar.
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${BASE_TITLE}`;
    }
    let metaEl;
    if (description) {
      metaEl = document.querySelector('meta[name="description"]');
      if (metaEl) {
        const prev = metaEl.getAttribute('content');
        metaEl.setAttribute('content', description);
        // Guardar el previo para restaurar
        metaEl.dataset.prev = prev || '';
      }
    }
    return () => {
      document.title = `${BASE_TITLE} | Restauración Matrimonial en Cristo`;
      if (metaEl && metaEl.dataset.prev !== undefined) {
        metaEl.setAttribute('content', metaEl.dataset.prev);
      }
    };
  }, [title, description]);
}
