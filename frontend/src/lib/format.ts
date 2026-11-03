export function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return y && m && d ? `${d}/${m}/${y}` : iso
}

export function formatNota(nota?: number | null): string {
  if (nota === null || nota === undefined) return '—'
  return nota.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}

/** Data de hoje no fuso local, no formato AAAA-MM-DD (sem desvio de UTC). */
export function todayISO(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const SEMESTRE_REGEX = /^\d{4}\.[12]$/
