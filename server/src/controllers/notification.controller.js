import { notificationService } from '../services/notification.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const notificationController = {
  async getMyNotifications(req, res, next) {
    try {
      const { page, limit } = req.query;
      return successResponse(res, await notificationService.getByUser(req.user.id, { page: Number(page) || 1, limit: Number(limit) || 20 }));
    } catch (e) { next(e); }
  },

  async getUnreadCount(req, res, next) {
    try { return successResponse(res, await notificationService.getUnreadCount(req.user.id)); } catch (e) { next(e); }
  },

  async markAsRead(req, res, next) {
    try { return successResponse(res, await notificationService.markAsRead(req.params.id, req.user.id)); } catch (e) { next(e); }
  },

  async markAllAsRead(req, res, next) {
    try { return successResponse(res, await notificationService.markAllAsRead(req.user.id)); } catch (e) { next(e); }
  },

  async delete(req, res, next) {
    try { return successResponse(res, await notificationService.delete(req.params.id, req.user.id)); } catch (e) { next(e); }
  },

  // Admin
  async send(req, res, next) {
    try {
      const { userId, type, title, message, link } = req.body;
      if (!title || !message) return res.status(400).json({ success: false, message: 'Título y mensaje son requeridos' });
      return createdResponse(res, await notificationService.create({ userId, type, title, message, link }));
    } catch (e) { next(e); }
  },

  async broadcast(req, res, next) {
    try {
      const { type, title, message, link } = req.body;
      if (!title || !message) return res.status(400).json({ success: false, message: 'Título y mensaje son requeridos' });
      return createdResponse(res, await notificationService.createForAll({ type, title, message, link }));
    } catch (e) { next(e); }
  },
};
