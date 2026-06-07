export function formatCurrency(value) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount.toLocaleString('es-CO') : '0';
}

export function formatDate(timestamp) {
  if (!timestamp) return 'Sin fecha';
  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return date.toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
