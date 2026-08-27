import { useState, useEffect } from 'react';
import { useAvailability } from '../../hooks/useAvailability';
import { useToast } from '../../hooks/useToast';
import { appointmentService } from '../../services/appointment.service';
import BookingSteps from './BookingSteps';
import CalendarPicker from './CalendarPicker';
import TimeSlotGrid from './TimeSlotGrid';
import StepCoupleInfo from './StepCoupleInfo';
import StepReason from './StepReason';
import StepConfirmation from './StepConfirmation';
import Button from '../ui/Button';

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({ partnerName: '', reason: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [needsPayment, setNeedsPayment] = useState(false);

  const { slots, availableDates, loading, fetchByDate, fetchByMonth } = useAvailability();
  const { success, error } = useToast();

  useEffect(() => {
    const now = new Date();
    fetchByMonth(now.getFullYear(), now.getMonth() + 1);
  }, [fetchByMonth]);

  useEffect(() => {
    if (selectedDate) {
      fetchByDate(selectedDate);
      setSelectedSlot(null);
    }
  }, [selectedDate, fetchByDate]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot || !formData.partnerName) {
      error('Faltan datos. Vuelve a intentar.');
      setStep(1);
      return;
    }
    setSubmitting(true);
    try {
      await appointmentService.create({
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        partnerName: formData.partnerName,
        reason: formData.reason,
        notes: formData.notes,
      });
      success('¡Cita agendada con éxito!');
      setNeedsPayment(result.needsPayment || false);
      setStep(4);
    } catch (err) {
      error(err.message || 'Error al agendar la cita');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 4) return <StepConfirmation needsPayment={needsPayment} />;

  return (
    <div>
      <BookingSteps currentStep={step} />

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecciona una fecha</h3>
            <CalendarPicker
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              availableDates={availableDates}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecciona un horario</h3>
            {selectedDate ? (
              <TimeSlotGrid
                slots={slots}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
                selectedDate={selectedDate}
                loading={loading}
              />
            ) : (
              <p className="text-sm text-gray-500 py-8 text-center">
                Selecciona una fecha para ver los horarios disponibles.
              </p>
            )}
            {selectedSlot && (
              <div className="mt-6">
                <Button onClick={() => setStep(2)} className="w-full">
                  Continuar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <StepCoupleInfo
          formData={formData}
          setFormData={setFormData}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && selectedSlot && (
        <StepReason
          formData={{ ...formData, date: selectedDate, startTime: selectedSlot.startTime, endTime: selectedSlot.endTime }}
          onSubmit={handleSubmit}
          onBack={() => setStep(2)}
          loading={submitting}
        />
      )}

      {step === 3 && !selectedSlot && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Se perdió la selección de horario. Por favor vuelve a elegir.</p>
          <Button onClick={() => setStep(1)}>Volver al calendario</Button>
        </div>
      )}
    </div>
  );
}
