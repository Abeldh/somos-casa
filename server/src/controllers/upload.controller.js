import crypto from 'crypto';
import { successResponse } from '../utils/apiResponse.js';

/**
 * Genera una firma para uploads seguros a Cloudinary
 * El frontend solicita la firma → sube con la firma → Cloudinary valida
 * Esto previene que alguien suba archivos sin estar autenticado
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'nydmdxao';
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const uploadController = {
  async getSignature(req, res, next) {
    try {
      if (!API_SECRET) {
        // Si no hay secret, permitir unsigned (fallback)
        return successResponse(res, { unsigned: true, cloudName: CLOUD_NAME, uploadPreset: 'ml_default' });
      }

      const timestamp = Math.round(new Date().getTime() / 1000);
      const folder = req.query.folder || 'somos-casa';

      const params = `folder=${folder}&timestamp=${timestamp}`;
      const signature = crypto
        .createHash('sha1')
        .update(params + API_SECRET)
        .digest('hex');

      return successResponse(res, {
        signature,
        timestamp,
        cloudName: CLOUD_NAME,
        folder,
        apiKey: process.env.CLOUDINARY_API_KEY,
      });
    } catch (error) {
      next(error);
    }
  },
};
