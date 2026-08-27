import { errorResponse } from '../utils/apiResponse.js';

/**
 * Middleware de validación con Zod.
 * @param {import('zod').ZodSchema} schema - Schema de Zod
 * @param {'body' | 'query' | 'params'} source - De dónde tomar los datos
 */
export function validateZod(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return errorResponse(res, 'Errores de validación', 422, errors);
    }
    // Reemplazar con datos parseados (tipos correctos, defaults aplicados)
    req[source] = result.data;
    next();
  };
}
