import _Big from 'big.js'
import { Token } from './Token'
import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { Currency, BigintIsh, Rounding, SolidityIntegerType } from '../types'
import { validateSolidityIntegerType } from '../utils'
import { Fraction } from './Fraction'
import toFormat from 'toformat'
import { MAX_DECIMAL_PLACES } from '../constants/index'
import { parseUnits } from '@ethersproject/units'

const Big = toFormat(_Big)

export class CurrencyAmount<T extends Currency = Currency> extends Fraction {
  public readonly currency: T
  public readonly decimalScale: JSBI

  public static fromFloatAmount<T extends Currency>(value: string, currency: T): CurrencyAmount<T> {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    return CurrencyAmount.fromRawAmount(currency, typedValueParsed)
  }
  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  public static fromRawAmount<T extends Currency>(currency: T, rawAmount: BigintIsh): CurrencyAmount<T> {
    return new CurrencyAmount(currency, rawAmount)
  }

  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */
  public static fromFractionalAmount<T extends Currency>(currency: T, numerator: BigintIsh, denominator: BigintIsh): CurrencyAmount<T> {
    return new CurrencyAmount(currency, numerator, denominator)
  }

  constructor(currency: T, numerator: BigintIsh, denominator?: BigintIsh) {
    super(numerator, denominator)
    validateSolidityIntegerType(this.quotient, SolidityIntegerType.uint256)
    this.currency = currency
    this.decimalScale = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals))
  }

  public add(other: CurrencyAmount<T>): CurrencyAmount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const added = super.add(other)
    return CurrencyAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator)
  }

  public subtract(other: CurrencyAmount<T>): CurrencyAmount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const subtracted = super.subtract(other)
    return CurrencyAmount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator)
  }

  public multiply(other: Fraction | BigintIsh): CurrencyAmount<T> {
    const multiplied = super.multiply(other)
    return CurrencyAmount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator)
  }

  public divide(other: Fraction | BigintIsh): CurrencyAmount<T> {
    const divided = super.divide(other)
    return CurrencyAmount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator)
  }

  public toSignificant(significantDigits: number = 6, format?: object, rounding: Rounding = Rounding.ROUND_DOWN): string {
    return super.divide(this.decimalScale).toSignificant(significantDigits, format, rounding)
  }

  public toFixed(decimalPlaces: number = this.currency.decimals, format?: object, rounding: Rounding = Rounding.ROUND_DOWN): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.divide(this.decimalScale).toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.quotient.toString()).div(this.decimalScale.toString()).toFormat(format)
  }

  public toDecimalPlaces(decimals?: number, format?: object, rounding: Rounding = Rounding.ROUND_DOWN): string {
    if (decimals) {
      invariant(
        decimals <= this.currency.decimals,
        `decimalsPlaces param must be less or equal to token decimals. Received: ${decimals}, currency decimals: ${this.currency.decimals}`
      )
    }
    const defaultDecimalsPlaces = this.currency.decimals < MAX_DECIMAL_PLACES ? this.currency.decimals : MAX_DECIMAL_PLACES

    return super.divide(this.decimalScale).toDecimalPlaces(decimals ?? defaultDecimalsPlaces, format, rounding)
  }

  public get wrapped(): CurrencyAmount<Token> {
    if (this.currency instanceof Token) {
      return this as CurrencyAmount<Token>
    }
    //@ts-ignore
    return CurrencyAmount.fromFractionalAmount(this.currency.wrappedToken, this.numerator, this.denominator)
  }
}
