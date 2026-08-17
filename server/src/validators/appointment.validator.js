export const createAppointmentSchema = {
  date: { required: true, message: 'La fecha es obligatoria' },
  startTime: { required: true, message: 'La hora de inicio es obligatoria' },
  endTime: { required: true, message: 'La hora de fin es obligatoria' },
  partnerName: { required: true, message: 'El nombre de la pareja es obligatorio' },
  reason: { required: true, minLength: 10, message: 'El motivo es obligatorio (mínimo 10 caracteres)' },
};

export const updateStatusSchema = {
  status: { required: true, enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'], message: 'Estado inválido' },
};
