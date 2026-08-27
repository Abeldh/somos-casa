import { useState } from 'react';
import { Lock, Shield, Eye, EyeOff, CheckCircle, UserPlus } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../services/api';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const ch = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: null }));
    setDone(false);
  };

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Ingresa tu contraseña actual';
    if (!form.newPassword) errs.newPassword = 'Ingresa la nueva contraseña';
    else if (form.newPassword.length < 8) errs.newPassword = 'Mínimo 8 caracteres';
    else if (form.newPassword === form.currentPassword) errs.newPassword = 'Debe ser diferente a la actual';
    if (!form.confirmPassword) errs.confirmPassword = 'Confirma la nueva contraseña';
    else if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      success('Contraseña actualizada correctamente');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setDone(true);
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = (password) => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return { level: score, label: 'Débil', color: 'bg-red-500' };
    if (score <= 3) return { level: score, label: 'Media', color: 'bg-yellow-500' };
    return { level: score, label: 'Fuerte', color: 'bg-green-500' };
  };

  const strength = getStrength(form.newPassword);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Administra la seguridad de tu cuenta.</p>
      </div>

      <div className="max-w-lg">
        {/* Info del usuario */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-600" />
            Cuenta
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Usuario</span>
              <span className="text-gray-900 font-medium">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-900 font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Rol</span>
              <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full font-medium">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Cambio de contraseña */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary-600" />
            Cambiar Contraseña
          </h3>

          {done && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700">Contraseña actualizada. Se cerrarán las demás sesiones activas.</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Contraseña actual */}
            <div className="relative">
              <Input
                label="Contraseña actual"
                name="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                value={form.currentPassword}
                onChange={ch}
                error={errors.currentPassword}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Nueva contraseña */}
            <div className="relative">
              <Input
                label="Nueva contraseña"
                name="newPassword"
                type={showNew ? 'text' : 'password'}
                value={form.newPassword}
                onChange={ch}
                error={errors.newPassword}
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength meter */}
            {form.newPassword && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= strength.level ? strength.color : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className={`text-xs ${strength.level <= 2 ? 'text-red-500' : strength.level <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                  Seguridad: {strength.label}
                </p>
              </div>
            )}

            {/* Confirmar */}
            <Input
              label="Confirmar nueva contraseña"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={ch}
              error={errors.confirmPassword}
              placeholder="Repite la nueva contraseña"
            />

            <div className="pt-2">
              <Button type="submit" loading={loading} className="w-full flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Actualizar Contraseña
              </Button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Al cambiar la contraseña se cerrarán todas las sesiones activas en otros dispositivos.
            </p>
          </div>
        </form>

        {/* Crear administrador */}
        <CreateAdminSection />
      </div>
    </div>
  );
}

function CreateAdminSection() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [adminForm, setAdminForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [adminErrors, setAdminErrors] = useState({});

  const handleChange = (e) => {
    setAdminForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setAdminErrors((p) => ({ ...p, [e.target.name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!adminForm.firstName.trim()) errs.firstName = 'Nombre es requerido';
    if (!adminForm.lastName.trim()) errs.lastName = 'Apellido es requerido';
    if (!adminForm.email.trim()) errs.email = 'Email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminForm.email)) errs.email = 'Email inválido';
    if (!adminForm.password) errs.password = 'Contraseña es requerida';
    else if (adminForm.password.length < 8) errs.password = 'Mínimo 8 caracteres';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setAdminErrors(errs); return; }

    setLoading(true);
    try {
      await api.post('/users/create-admin', adminForm);
      success('Administrador creado exitosamente');
      setAdminForm({ firstName: '', lastName: '', email: '', password: '', phone: '' });
    } catch (err) {
      error(err.message || 'Error al crear administrador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <UserPlus className="w-4 h-4 text-primary-600" />
        Crear Administrador
      </h3>
      <p className="text-sm text-gray-500 mb-4">Agrega un nuevo usuario con rol de administrador.</p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Nombre" name="firstName" value={adminForm.firstName} onChange={handleChange} error={adminErrors.firstName} placeholder="Juan" />
          <Input label="Apellido" name="lastName" value={adminForm.lastName} onChange={handleChange} error={adminErrors.lastName} placeholder="Pérez" />
        </div>
        <Input label="Correo electrónico" name="email" type="email" value={adminForm.email} onChange={handleChange} error={adminErrors.email} placeholder="admin@somoscasa.com" />
        <Input label="Teléfono (opcional)" name="phone" value={adminForm.phone} onChange={handleChange} placeholder="55 1234 5678" />
        <div className="relative">
          <Input
            label="Contraseña"
            name="password"
            type={showPass ? 'text' : 'password'}
            value={adminForm.password}
            onChange={handleChange}
            error={adminErrors.password}
            placeholder="Mínimo 8 caracteres"
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <Button type="submit" loading={loading} className="w-full flex items-center justify-center gap-2">
          <UserPlus className="w-4 h-4" />
          Crear Administrador
        </Button>
      </div>
    </form>
  );
}
