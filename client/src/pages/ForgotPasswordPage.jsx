import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import api from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { error('Ingresa tu correo electrónico'); return; }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) { error(err.message); }
    finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Revisa tu correo</h1>
          <p className="text-gray-500 mb-6">
            Si <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña. Revisa también tu carpeta de spam.
          </p>
          <p className="text-sm text-gray-400 mb-8">El enlace expira en 1 hora y solo puede usarse una vez.</p>
          <Link to="/login">
            <Button variant="outline" className="flex items-center gap-2 mx-auto">
              <ArrowLeft className="w-4 h-4" />
              Volver a Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={64} />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900">¿Olvidaste tu contraseña?</h1>
          <p className="text-gray-500 mt-2">Ingresa tu correo y te enviaremos un enlace para restablecerla.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm space-y-5">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
          />

          <Button type="submit" loading={loading} className="w-full flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            Enviar enlace de recuperación
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
