import JSBI from 'jsbi'
import { BigintIsh, Rounding } from 'types'
import { Fraction } from './Fraction'

const ONE_HUNDRED = new Fraction(JSBI.BigInt(100))

export class Percent extends Fraction {
  /**
   * Converts a fraction to a percent
   * @param fraction the fraction to convert
   */
  private static tryParseToPercent(fraction: Fraction) {
    return new Percent(fraction.numerator, fraction.denominator)
  }

  public add(other: Fraction | BigintIsh): Percent {
    return Percent.tryParseToPercent(super.add(other))
  }

  public subtract(other: Fraction | BigintIsh): Percent {
    return Percent.tryParseToPercent(super.subtract(other))
  }

  public multiply(other: Fraction | BigintIsh): Percent {
    return Percent.tryParseToPercent(super.multiply(other))
  }

  public divide(other: Fraction | BigintIsh): Percent {
    return Percent.tryParseToPercent(super.divide(other))
  }

  public toSignificant(significantDigits: number = 5, format?: object, rounding?: Rounding): string {
    return super.multiply(ONE_HUNDRED).toSignificant(significantDigits, format, rounding)
  }

  public toFixed(decimalPlaces: number = 2, format?: object, rounding?: Rounding): string {
    return super.multiply(ONE_HUNDRED).toFixed(decimalPlaces, format, rounding)
  }

  public toDecimalPlaces(decimalPlaces: number = 2, format?: object, rounding?: Rounding): string {
    return this.multiply(ONE_HUNDRED).toDecimalPlaces(decimalPlaces, format, rounding)
  }
}
