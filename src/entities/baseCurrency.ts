import { ChainId } from 'constants'
import { Currency, Token } from 'entities'
import invariant from 'tiny-invariant'

export abstract class BaseCurrency {
  public abstract readonly isNative: boolean
  public abstract readonly isToken: boolean

  public readonly chainId: ChainId
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string

  protected constructor(chainId: ChainId, decimals: number, symbol?: string, name?: string) {
    invariant(Number.isSafeInteger(chainId), 'CHAIN_ID')
    invariant(decimals >= 0 && decimals < 255 && Number.isInteger(decimals), 'DECIMALS')

    this.chainId = chainId
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }

  public abstract equals(other: Currency): boolean

  public abstract get wrapped(): Token
}
