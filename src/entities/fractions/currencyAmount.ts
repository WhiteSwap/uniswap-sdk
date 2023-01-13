import { Currency } from '../currency'
import { NativeCurrency } from '../nativeCurrency'
import { currencyEquals } from '../token'
import { Fraction } from './fraction'
import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import _Big from 'big.js'
import toFormat from 'toformat'
import { MAX_DECIMAL_PLACES, TEN } from '../../constants/index'
import { parseBigintIsh, validateSolidityTypeInstance } from '../../utils'
import { BigintIsh, Rounding, SolidityType } from '../../types'

const Big = toFormat(_Big)

export class CurrencyAmount extends Fraction {
  public readonly currency: Currency

  /**
   * Helper that calls the constructor with the NATIVE currency
   * @param amount native currency amount in wei
   */
  public static native(currency: NativeCurrency, amount: BigintIsh): CurrencyAmount {
    return new CurrencyAmount(currency, amount)
  }

  // amount _must_ be raw, i.e. in the native representation
  protected constructor(currency: Currency, amount: BigintIsh) {
    const parsedAmount = parseBigintIsh(amount)
    validateSolidityTypeInstance(parsedAmount, SolidityType.uint256)

    super(parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(currency.decimals)))
    this.currency = currency
  }

  public get raw(): JSBI {
    return this.numerator
  }

  public add(other: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, JSBI.add(this.raw, other.raw))
  }

  public subtract(other: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, JSBI.subtract(this.raw, other.raw))
  }

  public toSignificant(
    significantDigits: number = 6,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(format)
  }

  public toDecimalPlaces(decimals?: number, format?: object, rounding: Rounding = Rounding.ROUND_DOWN): string {
    if (decimals) {
      invariant(
        decimals <= this.currency.decimals,
        `decimalsPlaces param must be less or equal to token decimals. Received: ${decimals}, currency decimals: ${this.currency.decimals}`
      )
    }
    const defaultDecimalsPlaces =
      this.currency.decimals < MAX_DECIMAL_PLACES ? this.currency.decimals : MAX_DECIMAL_PLACES

    return super.toDecimalPlaces(decimals ?? defaultDecimalsPlaces, format, rounding)
  }
}
