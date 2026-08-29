import { dashboardService } from '../services/dashboard.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const dashboardController = {
  async getMetrics(req, res, next) {
    try { return successResponse(res, await dashboardService.getAdminMetrics()); } catch (e) { next(e); }
  },

  async getFinancial(req, res, next) {
    try {
      const { year, month } = req.query;
      return successResponse(res, await dashboardService.getFinancialDashboard({ year: Number(year) || undefined, month: Number(month) || undefined }));
    } catch (e) { next(e); }
  },

  async getRecentActivity(req, res, next) {
    try {
      const limit = Number(req.query.limit) || 10;
      return successResponse(res, await dashboardService.getRecentActivity(limit));
    } catch (e) { next(e); }
  },

  async getSystemHealth(req, res, next) {
    try { return successResponse(res, await dashboardService.getSystemHealth()); } catch (e) { next(e); }
  },
};
