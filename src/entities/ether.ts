import invariant from 'tiny-invariant'
import { Currency } from 'entities/currency'
import { NativeCurrency } from 'entities/nativeCurrency'
import { Token } from 'entities/token'
import { WETH } from 'entities'

/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export class Ether extends NativeCurrency {
  protected constructor(chainId: number) {
    super(chainId, 18, 'ETH', 'Ether')
  }

  public get wrapped(): Token {
    const weth = WETH[this.chainId]
    invariant(!!weth, 'WRAPPED')
    return weth
  }

  private static _etherCache: { [chainId: number]: Ether } = {}

  public static onChain(chainId: number): Ether {
    return this._etherCache[chainId] ?? (this._etherCache[chainId] = new Ether(chainId))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}
