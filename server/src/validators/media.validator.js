export const createMediaSchema = {
  type: { required: true, enum: ['SPOTIFY', 'YOUTUBE'], message: 'Tipo debe ser SPOTIFY o YOUTUBE' },
  title: { required: true, message: 'El título es obligatorio' },
  url: { required: true, isUrl: true, message: 'La URL es obligatoria y debe ser válida' },
};
