import { useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cart.service';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

export function useCart() {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const setCartData = (data) => { setItems(data.items || []); setSubtotal(data.subtotal || 0); setItemCount(data.itemCount || 0); };

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try { setCartData(await cartService.getCart()); } catch (err) { console.error(err.message); } finally { setLoading(false); }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = async (bookId, quantity = 1) => { try { setCartData(await cartService.addItem(bookId, quantity)); success('Agregado al carrito'); } catch (err) { error(err.message); } };
  const updateQuantity = async (itemId, qty) => { try { setCartData(await cartService.updateQuantity(itemId, qty)); } catch (err) { error(err.message); } };
  const removeItem = async (itemId) => { try { setCartData(await cartService.removeItem(itemId)); success('Item eliminado'); } catch (err) { error(err.message); } };
  const clearCart = async () => { try { setCartData(await cartService.clearCart()); } catch (err) { error(err.message); } };

  return { items, subtotal, itemCount, loading, fetchCart, addItem, updateQuantity, removeItem, clearCart };
}
