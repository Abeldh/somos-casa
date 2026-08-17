import { errorResponse } from '../utils/apiResponse.js';

export function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors.push({ field, message: rules.message || `${field} es obligatorio` });
        continue;
      }

      if (value && rules.minLength && value.length < rules.minLength) {
        errors.push({ field, message: `${field} debe tener al menos ${rules.minLength} caracteres` });
      }

      if (value && rules.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push({ field, message: 'Formato de email inválido' });
      }

      if (value && rules.isUrl && !/^https?:\/\/.+/.test(value)) {
        errors.push({ field, message: 'Formato de URL inválido' });
      }

      if (value && rules.enum && !rules.enum.includes(value)) {
        errors.push({ field, message: `${field} debe ser uno de: ${rules.enum.join(', ')}` });
      }
    }

    if (errors.length > 0) {
      return errorResponse(res, 'Errores de validación', 422, errors);
    }

    next();
  };
}
