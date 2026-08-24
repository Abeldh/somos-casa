import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hora en milisegundos

/**
 * Hook que cierra sesión automáticamente tras 1 hora de inactividad.
 * Detecta: clicks, teclas, scroll, movimiento de mouse, toques en mobile.
 * Se resetea con cualquier interacción del usuario.
 */
export function useInactivityLogout() {
  const { isAuthenticated, logout } = useAuth();
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (isAuthenticated) {
        logout();
        window.location.href = '/login?expired=inactivity';
      }
    }, INACTIVITY_TIMEOUT);
  }, [isAuthenticated, logout]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'mousemove', 'touchstart'];

    // Iniciar timer
    resetTimer();

    // Resetear en cada interacción
    const handleActivity = () => resetTimer();
    events.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [isAuthenticated, resetTimer]);
}
