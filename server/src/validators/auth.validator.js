export const registerSchema = {
  firstName: { required: true, maxLength: 100, message: 'El nombre es obligatorio' },
  lastName: { required: true, maxLength: 100, message: 'El apellido es obligatorio' },
  email: { required: true, isEmail: true, maxLength: 254, message: 'El email es obligatorio' },
  password: { required: true, minLength: 8, maxLength: 128, message: 'La contraseña debe tener mínimo 8 caracteres' },
};

export const loginSchema = {
  email: { required: true, isEmail: true, maxLength: 254, message: 'El email es obligatorio' },
  password: { required: true, maxLength: 128, message: 'La contraseña es obligatoria' },
};
