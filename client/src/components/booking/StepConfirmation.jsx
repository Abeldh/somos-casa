import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, ArrowRight, Upload } from 'lucide-react';
import Button from '../ui/Button';
import ProofUpload from '../ui/ProofUpload';
import { useToast } from '../../hooks/useToast';
import { appointmentService } from '../../services/appointment.service';

export default function StepConfirmation({ needsPayment = false }) {
  const [proofUrl, setProofUrl] = useState('');
  const { success, error } = useToast();

  const handleProofUpload = async (url) => {
    setProofUrl(url);
    if (url) {
      try {
        await appointmentService.uploadSessionProof(url);
        success('Comprobante enviado. El administrador verificará tu pago y liberará tus sesiones.');
      } catch (e) { error(e.message); }
    }
  };

  return (
    <div className="max-w-md mx-auto text-center animate-fade-in py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 mb-2">¡Cita agendada!</h3>

      {needsPayment ? (
        <>
          <p className="text-gray-600 mb-6">
            Tu cita fue registrada. Para confirmarla, realiza el pago del paquete mensual ($500 MXN — 4 sesiones) y adjunta tu comprobante.
          </p>

          <div className="bg-warm-50 rounded-xl p-5 text-left mb-6">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Datos de pago:</h4>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li><strong>Transferencia:</strong> 4027 6600 1036 6823</li>
              <li><strong>Beneficiario:</strong> Angélica Armenta Barajas</li>
              <li><strong>PayPal:</strong> <a href="https://paypal.me/AArmentaBarajas" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">paypal.me/AArmentaBarajas</a></li>
              <li><strong>Monto:</strong> $500.00 MXN (paquete 4 sesiones)</li>
              <li><strong>Concepto:</strong> Asesoría mensual</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">Envía tu comprobante por WhatsApp (722 414 8552) o a somoscasatoluca@gmail.com.</p>
          </div>

          <div className="text-left mb-6">
            <ProofUpload
              label="Adjuntar comprobante de pago"
              value={proofUrl}
              onChange={handleProofUpload}
            />
          </div>

          <p className="text-xs text-gray-500 mb-6">
            Una vez que el administrador verifique tu pago, se liberarán tus sesiones y tu cita será confirmada.
          </p>
        </>
      ) : (
        <p className="text-gray-600 mb-8">
          Tu sesión fue descontada de tu paquete. Recibirás una confirmación cuando el asesor apruebe tu cita.
        </p>
      )}

      <div className="space-y-3">
        <Link to="/dashboard">
          <Button className="w-full flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Ver mis citas
          </Button>
        </Link>
        <Link to="/">
          <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
            Volver al inicio
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
