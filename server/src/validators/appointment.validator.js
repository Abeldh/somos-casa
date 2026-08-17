export const createAppointmentSchema = {
  date: { required: true, message: 'La fecha es obligatoria' },
  startTime: { required: true, message: 'La hora de inicio es obligatoria' },
  endTime: { required: true, message: 'La hora de fin es obligatoria' },
  partnerName: { required: true, message: 'El nombre de la pareja es obligatorio' },
  reason: { required: true, minLength: 3, message: 'El motivo es obligatorio' },
};

export const updateStatusSchema = {
  status: { required: true, enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'], message: 'Estado inválido' },
};
