export function formatCurrency(
  amount: number,
  currency = 'USD',
  compact = false,
): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: compact ? 0 : 2,
    maximumFractionDigits: compact ? 0 : 2,
  }).format(amount)
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value}%`
}

export function maskCardNumber(number: string): string {
  const digits = number.replace(/\s/g, '')
  return `**** ${digits.slice(-4)}`
}
