import { MONTHS_ES } from './constants';

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month}, ${year}`;
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
  return d.toISOString().split('T')[0];
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
