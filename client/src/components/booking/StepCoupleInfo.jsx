import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

export default function StepCoupleInfo({ formData, setFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const { warning } = useToast();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.partnerName?.trim()) {
      newErrors.partnerName = 'El nombre de tu pareja es obligatorio';
    }
    if (!formData.reason?.trim()) {
      newErrors.reason = 'El motivo de la consulta es obligatorio';
    } else if (formData.reason.trim().length < 3) {
      newErrors.reason = 'El motivo debe tener al menos 3 caracteres';
    }
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const messages = Object.values(newErrors);
      warning(messages.join(' • '));
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Información de la pareja</h3>
        <p className="text-sm text-gray-500 mt-1">Cuéntanos un poco sobre ustedes</p>
      </div>

      <Input
        label="Nombre de tu pareja *"
        name="partnerName"
        value={formData.partnerName || ''}
        onChange={handleChange}
        placeholder="Nombre completo de tu pareja"
        error={errors.partnerName}
      />

      <Textarea
        label="Motivo de la consulta *"
        name="reason"
        value={formData.reason || ''}
        onChange={handleChange}
        placeholder="¿En qué te gustaría que te ayudemos? (comunicación, conflictos, intimidad, finanzas, etc.)"
        rows={4}
        error={errors.reason}
      />

      <Textarea
        label="Notas adicionales (opcional)"
        name="notes"
        value={formData.notes || ''}
        onChange={handleChange}
        placeholder="Cualquier información adicional que consideres relevante..."
        rows={3}
      />

      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Atrás
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continuar
        </Button>
      </div>
    </div>
  );
}
