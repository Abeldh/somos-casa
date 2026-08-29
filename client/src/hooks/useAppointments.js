import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointment.service';
import { useToast } from './useToast';

export function useAppointments(autoFetch = true) {
  const [appointments, setAppointments] = useState([]);
  const [sessionsRemaining, setSessionsRemaining] = useState(0);
  const [sessionsTotal, setSessionsTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const { error: showError } = useToast();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getMyAppointments();
      setAppointments(data.appointments || []);
      setSessionsRemaining(data.sessionsRemaining || 0);
      setSessionsTotal(data.sessionsTotal || 0);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchAll = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await appointmentService.getAll(params);
      setAppointments(data.appointments || []);
      setPagination({
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 10,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const cancelAppointment = async (id) => {
    try {
      await appointmentService.cancel(id);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a)));
      setSessionsRemaining((prev) => prev + 1);
    } catch (err) {
      showError(err.message);
    }
  };

  useEffect(() => {
    if (autoFetch) fetchAppointments();
  }, [autoFetch, fetchAppointments]);

  return { appointments, sessionsRemaining, sessionsTotal, loading, pagination, fetchAppointments, fetchAll, cancelAppointment };
}
