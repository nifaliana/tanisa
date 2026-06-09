import { MalagasyNumerals } from './dictionary'
import { inputToNativeDate } from './utils'

export interface ParsedDate {
  year: number
  month: number
  day: number
}

export function parseDate(input: string | Date | number): ParsedDate {
  // Date-object and numeric-timestamp branches are shared via inputToNativeDate
  if (input instanceof Date || typeof input === 'number') {
    const d = inputToNativeDate(input as Date | number)
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
  }

  // Strip ordinal indicators: "15th" → "15" (only needed for natural-language strings)
  const cleaned = (input as string).replace(/\b(\d+)(th|st|nd|rd)\b/g, '$1')

  // Parse "YYYY-MM-DD..." directly to avoid UTC midnight timezone drift
  const isoMatch = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const year = +isoMatch[1],
      month = +isoMatch[2],
      day = +isoMatch[3]
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      throw new TypeError(`Invalid date input: "${input}"`)
    }
    return { year, month, day }
  }

  const d = new Date(cleaned)
  if (isNaN(d.getTime())) throw new TypeError(`Invalid date input: "${input}"`)
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
}

export function formatShortDate(
  year: number,
  month: number,
  day: number
): string {
  return `${String(day).padStart(2, '0')} ${MalagasyNumerals.MONTHS[month]} ${year}`
}

export function formatLongDate(
  year: number,
  month: number,
  day: number,
  toWords: (n: number) => string
): string {
  const dayWord = day === 1 ? MalagasyNumerals.FIRST_OF_MONTH : toWords(day)
  return `${dayWord} ${MalagasyNumerals.MONTHS[month]}, ${MalagasyNumerals.YEAR_UNIT} ${toWords(year)}`
}
