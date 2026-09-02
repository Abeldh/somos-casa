/**
 * Optimiza URLs de imágenes de Cloudinary insertando transformaciones:
 * - f_auto: sirve el mejor formato para el navegador (WebP/AVIF cuando aplica)
 * - q_auto: calidad automática (reduce peso sin pérdida visible)
 * - c_limit,w_<ancho>: limita el ancho para no bajar imágenes gigantes en móvil
 *
 * Si la URL no es de Cloudinary (imagen local u otro origen), se devuelve intacta.
 * Es seguro llamarla con undefined/null.
 *
 * @param {string} url    URL de la imagen.
 * @param {object} [opts]
 * @param {number} [opts.width]  Ancho máximo deseado en px (c_limit).
 * @returns {string} URL optimizada o la original.
 */
export function cldImage(url, opts = {}) {
  if (!url || typeof url !== 'string') return url;
  // Solo transformamos URLs de entrega de Cloudinary que contienen "/upload/"
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (!url.includes('res.cloudinary.com') || idx === -1) return url;

  const transforms = ['f_auto', 'q_auto'];
  if (opts.width) transforms.push('c_limit', `w_${opts.width}`);

  // Evita duplicar transformaciones si ya se aplicaron antes
  const after = url.slice(idx + marker.length);
  if (after.startsWith('f_auto') || after.startsWith('q_auto') || after.startsWith('c_limit')) {
    return url;
  }

  return url.slice(0, idx + marker.length) + transforms.join(',') + '/' + after;
}
