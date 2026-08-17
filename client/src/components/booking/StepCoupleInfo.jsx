import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

export default function StepCoupleInfo({ formData, setFormData, onNext, onBack }) {
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const canProceed = formData.partnerName?.trim();

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Información de la pareja</h3>
        <p className="text-sm text-gray-500 mt-1">Cuéntanos un poco sobre ustedes</p>
      </div>

      <Input
        label="Nombre de tu pareja"
        name="partnerName"
        value={formData.partnerName || ''}
        onChange={handleChange}
        placeholder="Nombre completo de tu pareja"
      />

      <Textarea
        label="Motivo de la consulta"
        name="reason"
        value={formData.reason || ''}
        onChange={handleChange}
        placeholder="¿En qué te gustaría que te ayudemos? (comunicación, conflictos, intimidad, finanzas, etc.)"
        rows={4}
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
        <Button onClick={onNext} disabled={!canProceed} className="flex-1">
          Continuar
        </Button>
      </div>
    </div>
  );
}
