import { useState } from 'react';
import { formatDate, formatTime } from '../../utils/formatDate';
import Button from '../ui/Button';
import TermsCheckbox from '../ui/TermsCheckbox';
import { Calendar, Clock, User, FileText } from 'lucide-react';

export default function StepReason({ formData, onSubmit, onBack, loading }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(null);

  const handleSubmit = () => {
    if (!acceptedTerms) {
      setTermsError('Debes aceptar los Términos y Condiciones para continuar');
      return;
    }
    onSubmit();
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Confirma tu cita</h3>
        <p className="text-sm text-gray-500 mt-1">Verifica que toda la información sea correcta</p>
      </div>

      <div className="bg-warm-50 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-primary-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Fecha</p>
            <p className="text-sm text-gray-600">{formatDate(formData.date)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-primary-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Horario</p>
            <p className="text-sm text-gray-600">{formatTime(formData.startTime)} - {formatTime(formData.endTime)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-primary-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Pareja</p>
            <p className="text-sm text-gray-600">{formData.partnerName}</p>
          </div>
        </div>

        {formData.reason && (
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Motivo</p>
              <p className="text-sm text-gray-600">{formData.reason}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <TermsCheckbox
          checked={acceptedTerms}
          onChange={(v) => { setAcceptedTerms(v); setTermsError(null); }}
          error={termsError}
        />
      </div>

      <div className="flex gap-3 pt-6">
        <Button variant="ghost" onClick={onBack} className="flex-1" disabled={loading}>
          Atrás
        </Button>
        <Button onClick={handleSubmit} loading={loading} disabled={!acceptedTerms} className="flex-1">
          Confirmar Cita
        </Button>
      </div>
    </div>
  );
}
