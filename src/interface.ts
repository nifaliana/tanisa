import { MalagasyNumerals } from './dictionary'

export interface TanisaOptions {
  /**
   * If true, ignores the decimal part of the number.
   * @default false
   */
  ignoreDecimal?: boolean

  /**
   * Specifies the maximum number of decimal places to convert.
   * Extra decimal places will be truncated (not rounded).
   * Set to 0 to ignore decimals.
   * @default undefined (converts all decimal places)
   */
  decimalPlaces?: number
}

export type LargeNumberUnit =
  (typeof MalagasyNumerals.LARGE_NUMBER_UNITS)[number]

export type DateFormat = 'short' | 'long'

export interface TanisaDateOptions {
  /**
   * Controls the output format.
   * - `'short'` (default): `"25 Desambra 2022"`
   * - `'long'`: `"dimy amby roapolo Desambra, taona roa amby roapolo sy roa arivo"`
   */
  format?: DateFormat
}

export type TimePrecision = 'minutes' | 'seconds'

export interface TanisaTimeOptions {
  /**
   * Controls how many time components are spoken.
   * - `'minutes'` (default): hours and minutes only
   * - `'seconds'`: hours, minutes, and seconds (seconds omitted when zero)
   */
  precision?: TimePrecision
}
