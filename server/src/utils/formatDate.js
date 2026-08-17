export function toISODate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function getStartOfDay(dateStr) {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export function getEndOfDay(dateStr) {
  return new Date(`${dateStr}T23:59:59.999Z`);
}

export function getMonthRange(year, month) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}
