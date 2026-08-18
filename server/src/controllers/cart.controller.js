import { cartService } from '../services/cart.service.js';
import { successResponse } from '../utils/apiResponse.js';
export const cartController = {
  async getCart(req,res,next){try{return successResponse(res,await cartService.getCart(req.user.id));}catch(e){next(e);}},
  async addItem(req,res,next){try{const{bookId,quantity}=req.body;return successResponse(res,await cartService.addItem(req.user.id,bookId,quantity||1),'Agregado');}catch(e){next(e);}},
  async updateQuantity(req,res,next){try{return successResponse(res,await cartService.updateQuantity(req.user.id,req.params.id,req.body.quantity));}catch(e){next(e);}},
  async removeItem(req,res,next){try{return successResponse(res,await cartService.removeItem(req.user.id,req.params.id),'Eliminado');}catch(e){next(e);}},
  async clearCart(req,res,next){try{return successResponse(res,await cartService.clearCart(req.user.id));}catch(e){next(e);}},
};
