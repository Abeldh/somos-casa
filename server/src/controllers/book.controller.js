import { bookService } from '../services/book.service.js';
import { successResponse, createdResponse } from '../utils/apiResponse.js';
export const bookController = {
  async getAll(req,res,next){try{const {category,search,featured,page,limit}=req.query;return successResponse(res,await bookService.getAll({category,search,featured:featured==='true',page:parseInt(page)||1,limit:parseInt(limit)||12}));}catch(e){next(e);}},
  async getBySlug(req,res,next){try{return successResponse(res,await bookService.getBySlug(req.params.slug));}catch(e){next(e);}},
  async getCategories(req,res,next){try{return successResponse(res,await bookService.getCategories());}catch(e){next(e);}},
  async getFeatured(req,res,next){try{return successResponse(res,await bookService.getFeatured());}catch(e){next(e);}},
  async getAllAdmin(req,res,next){try{return successResponse(res,await bookService.getAllAdmin());}catch(e){next(e);}},
  async create(req,res,next){try{return createdResponse(res,await bookService.create(req.body),'Libro creado');}catch(e){next(e);}},
  async update(req,res,next){try{return successResponse(res,await bookService.update(req.params.id,req.body),'Actualizado');}catch(e){next(e);}},
  async remove(req,res,next){try{return successResponse(res,await bookService.remove(req.params.id));}catch(e){next(e);}},
  async toggleActive(req,res,next){try{return successResponse(res,await bookService.toggleActive(req.params.id));}catch(e){next(e);}},
  async toggleFeatured(req,res,next){try{return successResponse(res,await bookService.toggleFeatured(req.params.id));}catch(e){next(e);}},
};
