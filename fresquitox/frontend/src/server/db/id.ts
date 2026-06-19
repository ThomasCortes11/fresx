export function newId(prefix = 'fq'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatCop(amount: number): string {
  return '$' + amount.toLocaleString('es-CO');
}

export function parseCop(value: string | number): number {
  if (typeof value === 'number') return Math.max(0, Math.round(value));
  return Math.max(0, parseInt(String(value).replace(/\D/g, ''), 10) || 0);
}
