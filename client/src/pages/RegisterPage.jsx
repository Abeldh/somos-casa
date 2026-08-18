import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = form;

    if (!firstName || !lastName || !email || !password) {
      error('Completa los campos obligatorios');
      return;
    }
    if (password.length < 6) {
      error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password });
      success('¡Cuenta creada con éxito!');
      navigate('/dashboard');
    } catch (err) {
      error(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={64} />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Crea tu cuenta</h1>
          <p className="text-gray-500 mt-2">Únete a Somos Casa y fortalece tu matrimonio</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Juan" />
            <Input label="Apellido" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Pérez" />
          </div>

          <Input label="Correo electrónico" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />
          <Input label="Teléfono (opcional)" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+52 555 123 4567" />
          <Input label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
          <Input label="Confirmar contraseña" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repite tu contraseña" />

          <Button type="submit" loading={loading} className="w-full flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />
            Crear Cuenta
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
