import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView, disableAnalytics } from '../utils/analytics';
import { analyticsAllowed, CONSENT_EVENT } from '../utils/cookieConsent';

/**
 * Inicializa Google Analytics SOLO si el usuario consintió cookies analíticas
 * (opt-in, conforme a LFPDPPP/cookies) y registra un page view por ruta.
 * Reacciona en vivo al cambio de consentimiento: si el usuario acepta, GA se
 * activa sin recargar; los page views solo se envían con consentimiento vigente.
 */
export function useAnalytics() {
  const location = useLocation();
  const [allowed, setAllowed] = useState(() => analyticsAllowed());

  // Escuchar cambios de consentimiento (banner / página de cookies)
  useEffect(() => {
    const onChange = () => setAllowed(analyticsAllowed());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // Inicializar GA únicamente cuando hay consentimiento analítico;
  // si se retira el consentimiento, desactivar el envío en tiempo real.
  useEffect(() => {
    if (allowed) initAnalytics();
    else disableAnalytics();
  }, [allowed]);

  // Registrar page view solo si hay consentimiento
  useEffect(() => {
    if (allowed) trackPageView(location.pathname + location.search);
  }, [allowed, location.pathname, location.search]);
}
