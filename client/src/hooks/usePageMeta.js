import { useEffect } from 'react';

const BASE_TITLE = 'Somos Casa';
const DEFAULT_TITLE = `${BASE_TITLE} | Restauración Matrimonial en Cristo`;
// Origen del sitio en tiempo de ejecución (funciona con dominio propio o Railway).
const ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

function setMeta(selector, attr, value) {
  if (value == null) return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  const prev = el.getAttribute(attr);
  el.setAttribute(attr, value);
  return { el, attr, prev };
}

/**
 * Hook para actualizar los metadatos SEO por página, sin dependencias externas:
 * título, meta description, canonical, Open Graph (title/description/url) y,
 * opcionalmente, un bloque de datos estructurados JSON-LD (Article, Product, etc.).
 * Restaura los valores previos al desmontar.
 *
 * @param {string} title        Título de la página (se antepone a "| Somos Casa").
 * @param {string} description  Meta description.
 * @param {object} [options]
 * @param {string} [options.path]   Ruta canónica (ej. "/store"); por defecto usa la actual.
 * @param {string} [options.image]  URL absoluta de la imagen para Open Graph.
 * @param {object} [options.jsonLd] Objeto JSON-LD (schema.org) a inyectar.
 */
export function usePageMeta(title, description, options = {}) {
  const { path, image, jsonLd } = options;

  useEffect(() => {
    const restores = [];
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : DEFAULT_TITLE;
    const prevTitle = document.title;
    document.title = fullTitle;

    if (description) {
      const r = setMeta('meta[name="description"]', 'content', description);
      if (r) restores.push(r);
      const rog = setMeta('meta[property="og:description"]', 'content', description);
      if (rog) restores.push(rog);
    }

    if (title) {
      const r = setMeta('meta[property="og:title"]', 'content', fullTitle);
      if (r) restores.push(r);
    }

    // URL canónica y og:url
    const url = ORIGIN + (path || (typeof window !== 'undefined' ? window.location.pathname : ''));
    const rc = setMeta('link[rel="canonical"]', 'href', url);
    if (rc) restores.push(rc);
    const ru = setMeta('meta[property="og:url"]', 'content', url);
    if (ru) restores.push(ru);

    if (image) {
      const ri = setMeta('meta[property="og:image"]', 'content', image);
      if (ri) restores.push(ri);
      const rt = setMeta('meta[name="twitter:image"]', 'content', image);
      if (rt) restores.push(rt);
    }

    // Datos estructurados JSON-LD (se inyecta un <script> temporal marcado)
    let ldEl = null;
    if (jsonLd) {
      ldEl = document.createElement('script');
      ldEl.type = 'application/ld+json';
      ldEl.dataset.dynamic = 'true';
      ldEl.text = JSON.stringify(jsonLd);
      document.head.appendChild(ldEl);
    }

    return () => {
      document.title = prevTitle || DEFAULT_TITLE;
      for (const { el, attr, prev } of restores) {
        if (prev != null) el.setAttribute(attr, prev);
      }
      if (ldEl && ldEl.parentNode) ldEl.parentNode.removeChild(ldEl);
    };
  }, [title, description, path, image, jsonLd]);
}
