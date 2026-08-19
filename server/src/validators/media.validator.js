export const createMediaSchema = {
  type: { required: true, enum: ['SPOTIFY', 'YOUTUBE'], message: 'Tipo debe ser SPOTIFY o YOUTUBE' },
  title: { required: true, maxLength: 500, message: 'El título es obligatorio' },
  url: { required: true, isUrl: true, maxLength: 2000, message: 'La URL es obligatoria y debe ser válida' },
};
