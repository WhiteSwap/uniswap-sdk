import { ChainId } from 'types'
import { isValidAddress } from 'utils'
import { AbstractCurrency } from './AbstractCurrency'

interface IToken {
  readonly address: string
  equals: (other: Token) => boolean
  sortsBefore: (other: Token) => boolean
}

export class Token extends AbstractCurrency implements IToken {
  public readonly address: string

  constructor(chainId: ChainId, address: string, decimals: number, symbol: string, name: string, logoURI?: string) {
    super(chainId, decimals, symbol, name, logoURI)

    try {
      isValidAddress(address, chainId)
      this.address = address
    } catch (error) {
      throw error
    }
  }

  public equals(other: Token): boolean {
    return other instanceof Token && other.chainId === this.chainId && other.address === this.address
  }

  // TODO: remove from public methods
  public sortsBefore(other: Token): boolean {
    // FIXME: incorrect condition. Delete later
    if (this.equals(other)) {
      throw new Error('Tokens are equal. Cannot sort')
    }

    return this.address.toLowerCase() < other.address.toLowerCase()
  }
}
