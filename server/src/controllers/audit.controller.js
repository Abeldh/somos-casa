import prisma from '../config/database.js';
import { successResponse } from '../utils/apiResponse.js';

export const auditController = {
  /**
   * Obtener logs de auditoría con filtros
   */
  async getLogs(req, res, next) {
    try {
      const { userId, event, from, to, limit = 100 } = req.query;
      const where = {};
      if (userId) where.userId = userId;
      if (event) where.event = event;
      if (from || to) {
        where.createdAt = {};
        if (from) where.createdAt.gte = new Date(from);
        if (to) where.createdAt.lte = new Date(to);
      }

      const logs = await prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Math.min(parseInt(limit), 500),
      });

      return successResponse(res, { logs });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Exportar logs a CSV (descargable como Excel)
   */
  async exportCsv(req, res, next) {
    try {
      const { userId, event, from, to } = req.query;
      const where = {};
      if (userId) where.userId = userId;
      if (event) where.event = event;
      if (from || to) {
        where.createdAt = {};
        if (from) where.createdAt.gte = new Date(from);
        if (to) where.createdAt.lte = new Date(to);
      }

      const logs = await prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 5000,
      });

      // Generar CSV
      const BOM = '\uFEFF'; // Para que Excel reconozca UTF-8
      const headers = ['Fecha', 'Evento', 'Usuario ID', 'IP', 'Dispositivo', 'Navegador', 'Sistema Operativo', 'Detalle'];
      const rows = logs.map((log) => [
        new Date(log.createdAt).toLocaleString('es-MX'),
        log.event,
        log.userId || '',
        log.ip || '',
        log.deviceType || '',
        log.browser || '',
        log.os || '',
        (log.detail || '').replace(/"/g, '""'),
      ]);

      const csv = BOM + [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      const filename = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  },
};
