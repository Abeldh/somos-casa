/**
 * Gestión centralizada del consentimiento de cookies (LFPDPPP / cookies).
 *
 * Categorías:
 *  - necessary: técnicas imprescindibles (sesión, seguridad). Siempre activas.
 *  - analytics: analítica (Google Analytics). Requieren consentimiento EXPLÍCITO (opt-in).
 *
 * El consentimiento se guarda en localStorage con versión y fecha, para poder
 * re-solicitarlo si la política cambia y para tener evidencia de la decisión.
 */

export const CONSENT_VERSION = '1.0';
const STORAGE_KEY = 'cookie_consent';

// Evento que se dispara cuando cambia el consentimiento (para que la app reaccione)
export const CONSENT_EVENT = 'cookie-consent-changed';

/**
 * Devuelve el consentimiento guardado o null si el usuario aún no ha decidido.
 * @returns {{ necessary: boolean, analytics: boolean, version: string, date: string } | null}
 */
export function getConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Si la versión guardada no coincide con la vigente, se considera caducado
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** ¿El usuario ya tomó una decisión (aceptar o rechazar)? */
export function hasDecided() {
  return getConsent() !== null;
}

/** ¿Consintió cookies analíticas? Por defecto false (opt-in). */
export function analyticsAllowed() {
  const c = getConsent();
  return !!(c && c.analytics);
}

/**
 * Guarda la decisión del usuario y notifica a la app.
 * @param {{ analytics: boolean }} choices
 */
export function saveConsent({ analytics }) {
  const record = {
    necessary: true, // siempre activas
    analytics: !!analytics,
    version: CONSENT_VERSION,
    date: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
  }
  return record;
}

/** Aceptar todas las categorías (necesarias + analíticas). */
export function acceptAll() {
  return saveConsent({ analytics: true });
}

/** Aceptar solo las necesarias (rechaza analíticas). */
export function acceptNecessaryOnly() {
  return saveConsent({ analytics: false });
}

/** Borra la preferencia para volver a preguntar (usado en "restablecer preferencias"). */
export function resetConsent() {
  localStorage.removeItem(STORAGE_KEY);
}
