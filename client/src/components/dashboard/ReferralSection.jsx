import { useState, useEffect } from 'react';
import { Share2, Copy, CheckCircle, Users, Gift, Clock } from 'lucide-react';
import { referralService } from '../../services/referral.service';
import { useToast } from '../../hooks/useToast';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

export default function ReferralSection() {
  const [code, setCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const [codeRes, referralsRes] = await Promise.all([
        referralService.getMyCode(),
        referralService.getMyReferrals(),
      ]);
      setCode(codeRes.referralCode);
      setReferrals(referralsRes.referrals || []);
      setStats(referralsRes.stats || { total: 0, completed: 0, pending: 0 });
    } catch (e) { /* silencioso */ }
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    success('Codigo copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `Te invito a Somos Casa, plataforma de asesoria matrimonial. Usa mi codigo ${code} al registrarte y ambos recibimos beneficios. https://somos-casa-production.up.railway.app/register`;
    if (navigator.share) {
      navigator.share({ title: 'Somos Casa - Invitacion', text });
    } else {
      navigator.clipboard.writeText(text);
      success('Texto de invitacion copiado');
    }
  };

  if (loading) return <Spinner className="py-6" />;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-gray-900">Programa de Referidos</h3>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Comparte tu codigo con amigos. Cuando completen su primera sesion, ambos reciben una sesion extra gratis.
      </p>

      {/* Codigo de referido */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-5">
        <p className="text-xs text-primary-600 font-medium mb-1">Tu codigo de referido</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-mono font-bold text-primary-800 tracking-wider">{code}</span>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
            title="Copiar"
          >
            {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary-600" />}
          </button>
        </div>
      </div>

      <Button onClick={handleShare} variant="ghost" className="w-full flex items-center justify-center gap-2 mb-6">
        <Share2 className="w-4 h-4" /> Compartir invitacion
      </Button>

      {/* Estadisticas */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center bg-gray-50 rounded-lg p-3">
          <Users className="w-4 h-4 text-gray-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{stats.total}</p>
          <p className="text-[10px] text-gray-500">Referidos</p>
        </div>
        <div className="text-center bg-green-50 rounded-lg p-3">
          <Gift className="w-4 h-4 text-green-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-green-700">{stats.completed}</p>
          <p className="text-[10px] text-gray-500">Completados</p>
        </div>
        <div className="text-center bg-amber-50 rounded-lg p-3">
          <Clock className="w-4 h-4 text-amber-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-amber-700">{stats.pending}</p>
          <p className="text-[10px] text-gray-500">Pendientes</p>
        </div>
      </div>

      {/* Lista de referidos */}
      {referrals.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Historial de referidos</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {referrals.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">
                  {r.referred ? `${r.referred.firstName} ${r.referred.lastName}` : 'Invitado pendiente'}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  r.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  r.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {r.status === 'COMPLETED' ? 'Completado' : r.status === 'PENDING' ? 'Pendiente' : 'Expirado'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
