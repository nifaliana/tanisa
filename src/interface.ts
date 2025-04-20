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
