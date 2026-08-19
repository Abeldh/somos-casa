import { useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cart.service';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

// Evento global para sincronizar el carrito entre componentes
const cartListeners = new Set();
function notifyCartUpdate() { cartListeners.forEach((fn) => fn()); }

export function useCart() {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const set = (d) => {
    setItems(d.items || []);
    setSubtotal(d.subtotal || 0);
    setItemCount(d.itemCount || 0);
  };

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try { set(await cartService.getCart()); }
    catch (e) { console.error(e.message); }
    finally { setLoading(false); }
  }, [isAuthenticated]);

  // Fetch inicial + escuchar actualizaciones de otros componentes
  useEffect(() => { fetchCart(); }, [fetchCart]);
  useEffect(() => {
    cartListeners.add(fetchCart);
    return () => { cartListeners.delete(fetchCart); };
  }, [fetchCart]);

  const addItem = async (bookId, qty = 1) => {
    try {
      set(await cartService.addItem(bookId, qty));
      success('Agregado al carrito');
      notifyCartUpdate(); // Notifica al Header
    } catch (e) { error(e.message); }
  };

  const updateQuantity = async (id, qty) => {
    try {
      set(await cartService.updateQuantity(id, qty));
      notifyCartUpdate();
    } catch (e) { error(e.message); }
  };

  const removeItem = async (id) => {
    try {
      set(await cartService.removeItem(id));
      success('Item eliminado');
      notifyCartUpdate();
    } catch (e) { error(e.message); }
  };

  const clearCart = async () => {
    try {
      set(await cartService.clearCart());
      notifyCartUpdate();
    } catch (e) { error(e.message); }
  };

  return { items, subtotal, itemCount, loading, fetchCart, addItem, updateQuantity, removeItem, clearCart };
}
