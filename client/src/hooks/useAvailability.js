import { useState, useCallback } from 'react';
import { availabilityService } from '../services/availability.service';
import { useToast } from './useToast';

export function useAvailability() {
  const [slots, setSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error: showError } = useToast();

  const fetchByDate = useCallback(async (date) => {
    setLoading(true);
    try {
      const data = await availabilityService.getByDate(date);
      setSlots(data.slots || []);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchByMonth = useCallback(async (year, month) => {
    setLoading(true);
    try {
      const data = await availabilityService.getByMonth(year, month);
      setAvailableDates(data.dates || []);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  return { slots, availableDates, loading, fetchByDate, fetchByMonth };
}
