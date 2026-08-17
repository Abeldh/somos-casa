import { errorResponse } from '../utils/apiResponse.js';

export function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);
  console.error(err.stack);

  if (err.code === 'P2002') {
    return errorResponse(res, 'El registro ya existe', 409);
  }

  if (err.code === 'P2025') {
    return errorResponse(res, 'Registro no encontrado', 404);
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Error interno del servidor';

  return errorResponse(res, message, statusCode);
}
