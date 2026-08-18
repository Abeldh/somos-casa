import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Calendar, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { getInitials } from '../../utils/helpers';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={38} />
            <span className="font-display text-xl font-semibold text-gray-900">Somos Casa</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">
              Inicio
            </Link>
            <Link to="/store" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">
              Librería
            </Link>
            <Link to="/booking" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">
              Agendar
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link to="/admin" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">
                  Mis Citas
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-semibold">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Iniciar Sesión</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </nav>

          <button className="md:hidden text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <nav className="px-4 py-4 space-y-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">Inicio</Link>
            <Link to="/store" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">Librería</Link>
            <Link to="/booking" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">Agendar</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">Mis Citas</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">Admin</Link>}
                <button onClick={handleLogout} className="block py-2 text-red-600 font-medium">Cerrar Sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">Iniciar Sesión</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2 text-primary-600 font-medium">Registrarse</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
