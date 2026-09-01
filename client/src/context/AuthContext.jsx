import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await authService.getMe();
      setUser(data.user);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Si el interceptor de la API detecta que la sesión expiró (refresh falló),
  // limpiamos el estado aquí para que las rutas protegidas redirijan sin recarga dura.
  useEffect(() => {
    const onSessionExpired = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth:session-expired', onSessionExpired);
    return () => window.removeEventListener('auth:session-expired', onSessionExpired);
  }, []);

  const login = async (email, password, mfaCode) => {
    const data = await authService.login({ email, password, mfaCode });

    // Si requiere MFA, no setear tokens aún
    if (data.requireMfa) {
      return data;
    }

    const accessToken = data.accessToken || data.token;
    const refreshToken = data.refreshToken;

    localStorage.setItem('token', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    setToken(accessToken);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);

    const accessToken = data.accessToken || data.token;
    const refreshToken = data.refreshToken;

    localStorage.setItem('token', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    setToken(accessToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignorar error de logout en servidor
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logout();
      return null;
    }
    try {
      const data = await authService.refresh(refreshToken);
      localStorage.setItem('token', data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      setToken(data.accessToken);
      setUser(data.user);
      return data.accessToken;
    } catch {
      logout();
      return null;
    }
  };

  const isAdmin = user?.role === 'ADMIN';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, isAuthenticated, login, register, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
