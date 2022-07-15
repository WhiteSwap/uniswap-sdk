import { WRAPPED_NATIVE_CURRENCY } from 'constants/index'
import { BaseCurrency, Token, Currency } from 'entities'
import invariant from 'tiny-invariant'
import { ChainId } from 'types'

export class NativeCurrency extends BaseCurrency {
  public readonly isNative: true = true
  public readonly isToken: false = false

  public constructor(chainId: ChainId, decimals: number, symbol?: string, name?: string) {
    super(chainId, decimals, symbol, name)
  }

  public get wrapped(): Token {
    const wnc = WRAPPED_NATIVE_CURRENCY[this.chainId]
    invariant(!!wnc, 'WRAPPED')
    return wnc
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}
