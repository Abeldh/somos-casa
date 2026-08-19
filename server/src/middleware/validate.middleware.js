import { errorResponse } from '../utils/apiResponse.js';

export function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      // Required check
      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors.push({ field, message: rules.message || `${field} es obligatorio` });
        continue;
      }

      if (!value) continue;

      // String length
      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        errors.push({ field, message: `${field} debe tener al menos ${rules.minLength} caracteres` });
      }

      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        errors.push({ field, message: `${field} no puede exceder ${rules.maxLength} caracteres` });
      }

      // Email validation
      if (rules.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push({ field, message: 'Formato de email inválido' });
      }

      // URL validation
      if (rules.isUrl && !/^https?:\/\/.+/.test(value)) {
        errors.push({ field, message: 'Formato de URL inválido' });
      }

      // Enum validation
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push({ field, message: `${field} debe ser uno de: ${rules.enum.join(', ')}` });
      }

      // Number validation
      if (rules.isNumber && isNaN(Number(value))) {
        errors.push({ field, message: `${field} debe ser un número` });
      }

      if (rules.min !== undefined && Number(value) < rules.min) {
        errors.push({ field, message: `${field} debe ser mínimo ${rules.min}` });
      }

      if (rules.max !== undefined && Number(value) > rules.max) {
        errors.push({ field, message: `${field} debe ser máximo ${rules.max}` });
      }

      // Integer validation
      if (rules.isInteger && !Number.isInteger(Number(value))) {
        errors.push({ field, message: `${field} debe ser un número entero` });
      }
    }

    if (errors.length > 0) {
      return errorResponse(res, 'Errores de validación', 422, errors);
    }

    next();
  };
}
