import { MalagasyNumerals } from './dictionary'
import {
  TanisaOptions,
  TanisaDateOptions,
  TanisaTimeOptions,
  LargeNumberUnit,
} from './interface'
import { parseDate, formatShortDate, formatLongDate } from './date'
import { parseTime, formatTime } from './time'

export class Tanisa {
  // ─── Public API ────────────────────────────────────────────────────────────

  public toWords(number: number | string, options?: TanisaOptions): string {
    const ignoreDecimal = options?.ignoreDecimal ?? false
    const decimalPlaces = options?.decimalPlaces ?? -1

    const numStr = String(number).trim()

    // Scientific-notation string inputs (e.g. '1e15') make parseInt unreliable:
    // parseInt('1e15', 10) === 1, silently producing the word for 1 instead of an error.
    // Number-type inputs are safe because String(1e21) === '1e+21' is caught by the
    // MAX_SUPPORTED_INTEGER string-equality guard below.
    if (typeof number === 'string' && /[eE]/.test(numStr)) {
      throw new TypeError(`Invalid number input: "${number}"`)
    }

    const [integerPartStr, decimalPartStr] = numStr.split('.')
    const integerPartNum = parseInt(integerPartStr || '0', 10)

    if (
      isNaN(integerPartNum) ||
      (decimalPartStr &&
        decimalPartStr.length > 0 &&
        isNaN(parseInt(decimalPartStr, 10)))
    ) {
      throw new TypeError(`Invalid number input: "${number}"`)
    }

    // Reject negative numbers. '-0' (no decimal) is intentionally allowed and
    // returns 'aotra'. '-0.5' must be rejected: integerPartNum is 0 but the
    // fractional part is negative.
    if (
      numStr.startsWith('-') &&
      (integerPartNum !== 0 ||
        (decimalPartStr && parseInt(decimalPartStr, 10) > 0))
    ) {
      throw new RangeError('Negative numbers are not supported.')
    }

    if (
      integerPartNum >= MalagasyNumerals.MAX_SUPPORTED_INTEGER ||
      integerPartStr == MalagasyNumerals.MAX_SUPPORTED_INTEGER.toString()
    ) {
      throw new RangeError(
        `Number ${integerPartNum} exceeds the maximum supported value (${MalagasyNumerals.MAX_SUPPORTED_INTEGER}).`
      )
    }

    const integerWords = this.convertInteger(integerPartNum)

    let decimalWords = ''
    const processDecimals =
      decimalPartStr &&
      decimalPartStr.length > 0 &&
      !ignoreDecimal &&
      decimalPlaces !== 0

    if (processDecimals) {
      let effectiveDecimalPartStr = decimalPartStr

      if (decimalPlaces > 0 && decimalPartStr.length > decimalPlaces) {
        effectiveDecimalPartStr = decimalPartStr.substring(0, decimalPlaces)
      }

      if (parseInt(effectiveDecimalPartStr || '0', 10) > 0) {
        let tempDecimalWords = ''
        for (let i = 0; i < effectiveDecimalPartStr.length; i++) {
          const digit = effectiveDecimalPartStr[i]
          if (digit === '0') {
            tempDecimalWords += MalagasyNumerals.GLUE_DECIMAL_ZERO
          } else {
            const remainingDecimal = effectiveDecimalPartStr.substring(i)
            tempDecimalWords += this.convertInteger(
              parseInt(remainingDecimal, 10)
            )
            break
          }
        }
        if (tempDecimalWords) {
          decimalWords = MalagasyNumerals.GLUE_FAINGO + tempDecimalWords
        }
      }
    }

    return integerWords + decimalWords
  }

  public toDate(
    input: string | Date | number,
    options?: TanisaDateOptions
  ): string {
    const { year, month, day } = parseDate(input)
    if (options?.format === 'long') {
      return formatLongDate(year, month, day, (n) => this.toWords(n))
    }
    return formatShortDate(year, month, day)
  }

  public toTime(
    input: string | Date | number,
    options?: TanisaTimeOptions
  ): string {
    const { hours, minutes, seconds } = parseTime(input)
    return formatTime(
      hours,
      minutes,
      seconds,
      options?.precision ?? 'minutes',
      (n) => this.toWords(n)
    )
  }

  // ─── Private number-conversion helpers ─────────────────────────────────────

  private convertInteger(num: number): string {
    if (num === 0) return MalagasyNumerals.ZERO

    for (const unit of MalagasyNumerals.LARGE_NUMBER_UNITS) {
      if (num >= unit.threshold) return this.formatLargeNumber(num, unit)
    }

    return this.convertBelowThousand(num)
  }

  private formatLargeNumber(num: number, unit: LargeNumberUnit): string {
    const multiple = Math.floor(num / unit.threshold)
    const remainder = num % unit.threshold

    let prefix = ''
    // Use prefix only if multiple > 1, or multiple === 1 and unit is above 'arivo'
    if (multiple > 1) {
      prefix = this.convertInteger(multiple) + ' '
    } else if (multiple === 1 && unit.threshold > 1000) {
      prefix = MalagasyNumerals.DIGITS[1] + ' '
    }

    const basePart = prefix + unit.name

    if (remainder > 0) {
      return (
        this.convertInteger(remainder) + MalagasyNumerals.GLUE_SY + basePart
      )
    }
    return basePart
  }

  private convertBelowThousand(num: number): string {
    if (num >= 100) {
      const hundredMultiple = Math.floor(num / 100)
      const remainder = num % 100
      const hundredWord = MalagasyNumerals.HUNDREDS[hundredMultiple]

      if (remainder === 0) return hundredWord

      const remainderWords = this.convertBelowHundred(remainder)
      // Special rule: use "sy" when hundred base ≥ 200 AND remainder ≥ 10
      const glue =
        hundredMultiple >= 2 && remainder >= 10
          ? MalagasyNumerals.GLUE_SY
          : MalagasyNumerals.GLUE_AMBY
      const finalRemainder =
        remainder === 1 ? MalagasyNumerals.CUSTOM_ONE : remainderWords
      return finalRemainder + glue + hundredWord
    }
    return this.convertBelowHundred(num)
  }

  private convertTeens(num: number): string {
    const ones = num - 10
    const digitWord =
      ones === 1 ? MalagasyNumerals.CUSTOM_ONE : MalagasyNumerals.DIGITS[ones]
    return digitWord + MalagasyNumerals.GLUE_AMBIN_NY + MalagasyNumerals.TENS[1]
  }

  private convertBelowHundred(num: number): string {
    if (num >= 10) {
      if (num > 10 && num < 20) return this.convertTeens(num)

      const tenMultiple = Math.floor(num / 10)
      const remainder = num % 10
      const tenWord = MalagasyNumerals.TENS[tenMultiple]

      if (remainder === 0) return tenWord

      const digitWord =
        remainder === 1
          ? MalagasyNumerals.CUSTOM_ONE
          : MalagasyNumerals.DIGITS[remainder]
      return digitWord + MalagasyNumerals.GLUE_AMBY + tenWord
    }
    return MalagasyNumerals.DIGITS[num]
  }
}
