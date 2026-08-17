import { useState, useCallback, useRef } from 'react';
import { availabilityService } from '../services/availability.service';

export function useAvailability() {
  const [slots, setSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

  const fetchByDate = useCallback(async (date) => {
    setLoading(true);
    try {
      const data = await availabilityService.getByDate(date);
      setSlots(data.slots || []);
    } catch (err) {
      console.error('Error fetching slots:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByMonth = useCallback(async (year, month) => {
    setLoading(true);
    try {
      const data = await availabilityService.getByMonth(year, month);
      setAvailableDates(data.dates || []);
    } catch (err) {
      console.error('Error fetching month:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { slots, availableDates, loading, fetchByDate, fetchByMonth };
}
