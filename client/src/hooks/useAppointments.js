import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointment.service';
import { useToast } from './useToast';

export function useAppointments(autoFetch = true) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error: showError } = useToast();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getMyAppointments();
      setAppointments(data.appointments || []);
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
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const cancelAppointment = async (id) => {
    try {
      await appointmentService.cancel(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a))
      );
    } catch (err) {
      showError(err.message);
    }
  };

  useEffect(() => {
    if (autoFetch) fetchAppointments();
  }, [autoFetch, fetchAppointments]);

  return { appointments, loading, fetchAppointments, fetchAll, cancelAppointment };
}
