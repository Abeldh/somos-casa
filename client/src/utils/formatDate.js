import { MONTHS_ES } from './constants';

export function formatDate(dateStr) {
  // Parsear como fecha local (sin conversión UTC)
  const parts = String(dateStr).split('T')[0].split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const day = parseInt(parts[2]);
  return `${day} de ${MONTHS_ES[month]}, ${year}`;
}

export function formatTime(time) {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${suffix}`;
}

export function toISODate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export function isToday(date) {
  const today = new Date();
  const d = new Date(date);
  return d.toDateString() === today.toDateString();
}

export function isPast(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) < today;
}
