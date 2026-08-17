export const registerSchema = {
  firstName: { required: true, message: 'El nombre es obligatorio' },
  lastName: { required: true, message: 'El apellido es obligatorio' },
  email: { required: true, isEmail: true, message: 'El email es obligatorio' },
  password: { required: true, minLength: 6, message: 'La contraseña es obligatoria' },
};

export const loginSchema = {
  email: { required: true, isEmail: true, message: 'El email es obligatorio' },
  password: { required: true, message: 'La contraseña es obligatoria' },
};
