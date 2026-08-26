import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import api from '../services/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { error, success } = useToast();

  // Si no hay token en la URL
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Enlace inválido</h1>
          <p className="text-gray-500 mb-6">Este enlace de recuperación no es válido. Solicita uno nuevo.</p>
          <Link to="/forgot-password">
            <Button>Solicitar nuevo enlace</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">¡Contraseña actualizada!</h1>
          <p className="text-gray-500 mb-6">Tu contraseña ha sido restablecida. Ya puedes iniciar sesión con tu nueva contraseña.</p>
          <Link to="/login">
            <Button className="flex items-center gap-2 mx-auto">
              <Lock className="w-4 h-4" />
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStrength = (pw) => {
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 2) return { level: score, label: 'Débil', color: 'bg-red-500' };
    if (score <= 3) return { level: score, label: 'Media', color: 'bg-yellow-500' };
    return { level: score, label: 'Fuerte', color: 'bg-green-500' };
  };

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) { setErrorMsg('Mínimo 8 caracteres'); return; }
    if (password !== confirm) { setErrorMsg('Las contraseñas no coinciden'); return; }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setDone(true);
      success('Contraseña restablecida');
    } catch (err) {
      setErrorMsg(err.message);
      error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={64} />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Nueva contraseña</h1>
          <p className="text-gray-500 mt-2">Ingresa tu nueva contraseña para restablecer tu cuenta.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm space-y-5">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}

          <div className="relative">
            <Input
              label="Nueva contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
              placeholder="Mínimo 8 caracteres"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Strength meter */}
          {password && (
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

          <Input
            label="Confirmar contraseña"
            type="password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErrorMsg(''); }}
            placeholder="Repite tu nueva contraseña"
            error={confirm && password !== confirm ? 'No coinciden' : null}
          />

          <Button type="submit" loading={loading} className="w-full flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Restablecer Contraseña
          </Button>
        </form>
      </div>
    </div>
  );
}
