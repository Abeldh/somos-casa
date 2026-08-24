/**
 * Parsea el User-Agent para extraer información del dispositivo
 * Sin dependencias externas — regex-based
 */

export function parseDevice(userAgent) {
  if (!userAgent) return { type: 'Desconocido', browser: 'Desconocido', os: 'Desconocido' };

  const ua = userAgent.toLowerCase();

  // Tipo de dispositivo
  let type = 'Desktop';
  if (/mobile|android.*mobile|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    type = 'Móvil';
  } else if (/tablet|ipad|android(?!.*mobile)/i.test(ua)) {
    type = 'Tablet';
  }

  // Sistema operativo
  let os = 'Desconocido';
  if (/windows nt 10/i.test(ua)) os = 'Windows 10/11';
  else if (/windows nt/i.test(ua)) os = 'Windows';
  else if (/mac os x/i.test(ua)) os = 'macOS';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/cros/i.test(ua)) os = 'Chrome OS';

  // Navegador
  let browser = 'Desconocido';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/opr\//i.test(ua) || /opera/i.test(ua)) browser = 'Opera';
  else if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox/i.test(ua)) browser = 'Firefox';

  return { type, browser, os };
}
