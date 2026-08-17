import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Calendar, Clock, Film, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { classNames } from '../../utils/helpers';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/appointments', icon: Calendar, label: 'Citas' },
  { to: '/admin/availability', icon: Clock, label: 'Disponibilidad' },
  { to: '/admin/media', icon: Film, label: 'Multimedia' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="font-display text-lg font-semibold text-gray-900">Somos Casa</Link>
          <p className="text-xs text-gray-500 mt-1">Panel Administrativo</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => classNames(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Home className="w-4 h-4" />
            Ir al Sitio
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full transition-colors">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
