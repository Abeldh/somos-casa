import { useState } from 'react';
import { getDaysInMonth, getFirstDayOfMonth } from '../utils/formatDate';

export function useCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const goNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goPrev = () => {
    const now = new Date();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    if (new Date(prevYear, prevMonth + 1, 0) < now) return;
    setCurrentMonth(prevMonth);
    setCurrentYear(prevYear);
  };

  return { currentMonth, currentYear, daysInMonth, firstDay, goNext, goPrev };
}
