/**
 * Utility functions for date formatting
 */

/**
 * Parse date safely — handles null, undefined, and various formats
 * @param {string|Date} date
 * @returns {Date|null}
 */
function parseDate(date) {
  if (!date) return null
  const parsed = new Date(date)
  return isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Format date to Indonesian locale (dd/mm/yyyy)
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const d = parseDate(date)
  if (!d) return '-'
  return d.toLocaleDateString('id-ID')
}

/**
 * Format date with full details (e.g., "Senin, 11 Februari 2026")
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateFull(date) {
  const d = parseDate(date)
  if (!d) return '-'
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format date and time to Indonesian locale
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateTime(date) {
  const d = parseDate(date)
  if (!d) return '-'
  return d.toLocaleString('id-ID')
}

/**
 * Format date to short format (e.g., "11 Feb")
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateShort(date) {
  const d = parseDate(date)
  if (!d) return '-'
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  })
}

/**
 * Get today's date in YYYY-MM-DD format (for input[type="date"])
 * @returns {string}
 */
export function getTodayISO() {
  return new Date().toISOString().split('T')[0]
}