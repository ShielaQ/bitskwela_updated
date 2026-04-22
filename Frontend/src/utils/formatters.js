/* ─────────────────────────────────────────────────────────────────
   Shared formatting helpers used across Calculator and other pages.
   ───────────────────────────────────────────────────────────────── */

/**
 * Format a number as Philippine Peso.
 * ₱1,234.56  →  as-is
 * ₱12,000    →  ₱12.00K
 * ₱1,200,000 →  ₱1.20M
 */
export function fmtPeso(n) {
  if (n >= 1_000_000) return '₱' + (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000)     return '₱' + (n / 1_000).toFixed(2) + 'K'
  return '₱' + n.toFixed(2)
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Capitalise the first letter of a string.
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
