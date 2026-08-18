import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/order.service';
import { useToast } from './useToast';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try { const data = await orderService.getMyOrders(); setOrders(data.orders || []); } catch (err) { console.error(err.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  return { orders, loading, fetchOrders };
}

export function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const fetchOrders = useCallback(async (status) => {
    setLoading(true);
    try { const data = await orderService.getAll({ status }); setOrders(data.orders || []); } catch (err) { error(err.message); } finally { setLoading(false); }
  }, []);

  const updateStatus = async (id, status) => { try { await orderService.updateStatus(id, status); success('Estado actualizado'); fetchOrders(); } catch (err) { error(err.message); } };

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  return { orders, loading, fetchOrders, updateStatus };
}
