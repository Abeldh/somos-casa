import { errorResponse } from '../utils/apiResponse.js';

export function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return errorResponse(res, 'Acceso denegado. Se requiere rol de administrador.', 403);
  }
  next();
}
