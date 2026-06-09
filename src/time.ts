import { MalagasyNumerals } from './dictionary'
import { TimePrecision } from './interface'
import { inputToNativeDate } from './utils'

export interface ParsedTime {
  hours: number
  minutes: number
  seconds: number
}

export function parseTime(input: string | Date | number): ParsedTime {
  // Date-object and numeric-timestamp branches are shared via inputToNativeDate
  if (input instanceof Date || typeof input === 'number') {
    const d = inputToNativeDate(input as Date | number)
    return {
      hours: d.getHours(),
      minutes: d.getMinutes(),
      seconds: d.getSeconds(),
    }
  }

  // For ISO datetime strings, extract the time part after "T"
  const timeStr = (input as string).includes('T')
    ? (input as string).split('T')[1].split(/[-Z+]/)[0]
    : (input as string)

  const parts = timeStr.split(':')
  if (parts.length < 2) throw new TypeError(`Invalid time input: "${input}"`)

  const hourStr = parts[0]
  const minuteStr = parts[1]
  const secondStr = parts[2] ?? '0'

  // parseInt silently truncates trailing non-digits ('23abc' → 23) — reject upfront
  if (
    !/^\d+$/.test(hourStr) ||
    !/^\d+$/.test(minuteStr) ||
    !/^\d+$/.test(secondStr)
  ) {
    throw new TypeError(`Invalid time input: "${input}"`)
  }

  const hours = parseInt(hourStr, 10)
  const minutes = parseInt(minuteStr, 10)
  const seconds = parseInt(secondStr, 10)

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    throw new TypeError(`Invalid time input: "${input}"`)
  }

  return { hours, minutes, seconds }
}

export function getTimePeriod(hours: number): string {
  if (hours >= 1 && hours <= 9) return MalagasyNumerals.TIME_PERIODS.MARAINA
  if (hours >= 10 && hours <= 12) return MalagasyNumerals.TIME_PERIODS.ANTOANDRO
  if (hours >= 13 && hours <= 16)
    return MalagasyNumerals.TIME_PERIODS.TOLAKANDRO
  if (hours >= 17 && hours <= 19) return MalagasyNumerals.TIME_PERIODS.HARIVA
  return MalagasyNumerals.TIME_PERIODS.ALINA // 0 (midnight) and 20–23
}

export function formatTime(
  hours: number,
  minutes: number,
  seconds: number,
  precision: TimePrecision,
  toWords: (n: number) => string
): string {
  const period = getTimePeriod(hours)

  // Map to 12-hour clock: midnight (0) and noon (12) both display as 12
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours

  const parts: string[] = [
    `${toWords(displayHour)} ${MalagasyNumerals.HOUR_UNIT}`,
  ]

  if (minutes > 0) {
    parts.push(
      `${MalagasyNumerals.CONJ_SY} ${toWords(minutes)} ${MalagasyNumerals.MINUTE_UNIT}`
    )
  }

  if (seconds > 0 && precision === 'seconds') {
    parts.push(
      `${MalagasyNumerals.CONJ_SY} ${toWords(seconds)} ${MalagasyNumerals.SECOND_UNIT}`
    )
  }

  parts.push(period)
  return parts.join(' ')
}
