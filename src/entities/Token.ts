import { ChainId, Currency } from '../types'
import { hexlifyAddress, isValidAddress } from '../utils'
import { AbstractCurrency } from './AbstractCurrency'

interface IToken {
  readonly address: string
  equals: (other: Token) => boolean
  sortsBefore: (other: Token) => boolean
}

export class Token extends AbstractCurrency implements IToken {
  public isNative = false
  public readonly address: string

  constructor(chainId: ChainId, address: string, decimals: number, symbol: string, name: string, logoURI?: string) {
    super(chainId, decimals, symbol, name, logoURI)

    if (!isValidAddress(address, chainId)) {
      throw new Error(`Address: ${address} is invalid for chainId: ${chainId}`)
    }
    this.address = address
  }

  public equals(other: Currency): boolean {
    return other instanceof Token && other.chainId === this.chainId && other.address === this.address
  }

  public sortsBefore(other: Token): boolean {
    if (this.equals(other)) {
      throw new Error('Tokens are equal. Cannot sort')
    }
    return hexlifyAddress(this.address) < hexlifyAddress(other.address)
  }
}
