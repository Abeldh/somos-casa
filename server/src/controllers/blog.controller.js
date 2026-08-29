import { blogService } from '../services/blog.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';

export const blogController = {
  // Público
  async getPublished(req, res, next) {
    try { return successResponse(res, await blogService.getPublished()); } catch (e) { next(e); }
  },
  async getBySlug(req, res, next) {
    try { return successResponse(res, await blogService.getBySlug(req.params.slug)); } catch (e) { next(e); }
  },

  // Admin
  async getAll(req, res, next) {
    try { return successResponse(res, await blogService.getAll()); } catch (e) { next(e); }
  },
  async getById(req, res, next) {
    try { return successResponse(res, await blogService.getById(req.params.id)); } catch (e) { next(e); }
  },
  async create(req, res, next) {
    try {
      const { title, excerpt, content, coverImage, author, category, isPublished } = req.body;
      if (!title || !content) return res.status(400).json({ success: false, message: 'Título y contenido son requeridos' });
      return createdResponse(res, await blogService.create({ title, excerpt, content, coverImage, author, category, isPublished }), 'Artículo creado');
    } catch (e) { next(e); }
  },
  async update(req, res, next) {
    try { return successResponse(res, await blogService.update(req.params.id, req.body), 'Artículo actualizado'); } catch (e) { next(e); }
  },
  async remove(req, res, next) {
    try { return successResponse(res, await blogService.remove(req.params.id)); } catch (e) { next(e); }
  },
};
