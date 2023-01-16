import { WRAPPED_NATIVE_CURRENCY } from '../constants/currencies'
import { AbstractCurrency } from './AbstractCurrency'
import { ChainId, Currency } from '../types'
import { Token } from './Token'

interface INativeCurrency {
  equals: (other: NativeCurrency) => boolean
}

export class NativeCurrency extends AbstractCurrency implements INativeCurrency {
  public readonly wrappedToken: Token
  public readonly isNative = true

  constructor(chainId: ChainId, decimals: number, symbol: string, name: string, logoURI?: string) {
    super(chainId, decimals, symbol, name, logoURI)
    const wrappedToken = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (!wrappedToken) {
      throw new Error(`Wrapped currency doesn't exist for ${this.symbol} and ${this.chainId}`)
    }

    this.wrappedToken = wrappedToken
  }

  public equals(other: Currency): boolean {
    return other instanceof NativeCurrency && other.chainId === this.chainId
  }
}
