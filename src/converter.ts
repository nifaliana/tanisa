import { LargeNumberUnit, MalagasyNumerals } from ".";

export class MalagasyNumberToWords {
  public toWords(number: number | string): string {
    const numStr = String(number);
    const [integerPartStr, decimalPartStr] = numStr.split(".");
    const integerPartNum = parseInt(integerPartStr || "0", 10);

    if (
      isNaN(integerPartNum) ||
      (decimalPartStr && isNaN(parseInt(decimalPartStr, 10)))
    ) {
      throw new TypeError(`Invalid number input: "${number}"`);
    }

    if (numStr.trim().startsWith("-") && integerPartNum !== 0) {
      throw new RangeError("Negative numbers are not supported.");
    }

    if (
      integerPartNum >= MalagasyNumerals.MAX_SUPPORTED_INTEGER ||
      integerPartStr == MalagasyNumerals.MAX_SUPPORTED_INTEGER.toString()
    ) {
      throw new RangeError(
        `Number ${integerPartNum} exceeds the maximum supported value (${MalagasyNumerals.MAX_SUPPORTED_INTEGER}).`
      );
    }

    let integerWords = this.convertInteger(integerPartNum);

    let decimalWords = "";
    if (decimalPartStr && decimalPartStr.length > 0) {
      for (let i = 0; i < decimalPartStr.length; i++) {
        const digit = decimalPartStr[i];
        if (digit === "0") {
          decimalWords += MalagasyNumerals.GLUE_DECIMAL_ZERO;
        } else {
          const remainingDecimal = decimalPartStr.substring(i);
          decimalWords += this.convertInteger(parseInt(remainingDecimal, 10));
          break;
        }
      }
      return integerWords + MalagasyNumerals.GLUE_FAINGO + decimalWords;
    } else {
      return integerWords;
    }
  }

  private convertInteger(num: number): string {
    if (num === 0) {
      return MalagasyNumerals.ZERO;
    }

    for (const unit of MalagasyNumerals.LARGE_NUMBER_UNITS) {
      if (num >= unit.threshold) {
        return this.formatLargeNumber(num, unit);
      }
    }

    return this.convertBelowThousand(num);
  }

  private formatLargeNumber(num: number, unit: LargeNumberUnit): string {
    const multiple = Math.floor(num / unit.threshold);
    const remainder = num % unit.threshold;

    let prefix = "";
    // Use prefix only if multiple is greater than 1 OR
    // if multiple is 1 AND the unit is larger than 'arivo' (1000)
    if (multiple > 1) {
      prefix = this.convertInteger(multiple) + " ";
    } else if (multiple === 1 && unit.threshold > 1000) {
      prefix = MalagasyNumerals.DIGITS[1] + " ";
    }
    // If multiple is 1 and unit is 'arivo', no prefix is needed ("arivo", not "iray arivo")
    const basePart = prefix + unit.name;

    if (remainder > 0) {
      const remainderText = this.convertInteger(remainder);
      return remainderText + MalagasyNumerals.GLUE_SY + basePart;
    } else {
      return basePart;
    }
  }

  private convertBelowThousand(num: number): string {
    // Assumes 0 < num < 1000
    if (num >= 100) {
      const hundredMultiple = Math.floor(num / 100);
      const remainder = num % 100;
      const hundredWord = MalagasyNumerals.HUNDREDS[hundredMultiple];

      if (remainder === 0) {
        return hundredWord;
      } else {
        const remainderWords = this.convertBelowHundred(remainder);
        let glue = MalagasyNumerals.GLUE_AMBY as string;
        // Special rule: Use "sy" if hundred base >= 200 AND remainder >= 10
        if (hundredMultiple >= 2 && remainder >= 10) {
          glue = MalagasyNumerals.GLUE_SY;
        }
        // Use "iraika" for remainder 1 when connecting
        const finalRemainderWords =
          remainder === 1 ? MalagasyNumerals.CUSTOM_ONE : remainderWords;
        return finalRemainderWords + glue + hundredWord;
      }
    }
    return this.convertBelowHundred(num);
  }

  private convertBelowHundred(num: number): string {
    if (num >= 10) {
      const tenMultiple = Math.floor(num / 10);
      const remainder = num % 10;
      const tenWord = MalagasyNumerals.TENS[tenMultiple];

      if (remainder === 0) {
        return tenWord;
      } else {
        // Always use "amby" for tens+digits
        const digitWord =
          remainder === 1
            ? MalagasyNumerals.CUSTOM_ONE
            : MalagasyNumerals.DIGITS[remainder];
        return digitWord + MalagasyNumerals.GLUE_AMBY + tenWord;
      }
    }
    return MalagasyNumerals.DIGITS[num];
  }
}
