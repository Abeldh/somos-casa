export function successResponse(res, data = {}, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
}

export function errorResponse(res, message = 'Error interno', statusCode = 500, errors = null) {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
}

export function createdResponse(res, data = {}, message = 'Creado exitosamente') {
  return successResponse(res, data, message, 201);
}
