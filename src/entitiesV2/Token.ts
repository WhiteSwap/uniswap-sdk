import { ChainId } from 'types'
import IToken from 'types/Token.interface'
import { isValidAddress } from 'utils'
import { AbstractCurrency } from './AbstractCurrency'

class Token extends AbstractCurrency implements IToken {
  public readonly address: string

  constructor(chainId: ChainId, address: string, decimals: number, symbol: string, name: string, logoURI?: string) {
    super(chainId, decimals, symbol, name, logoURI)

    if (isValidAddress(address, chainId)) {
      this.address = address
    } else {
      throw new Error('Cannot create Token instance. Address is invalid')
    }
  }

  public equals(other: Token): boolean {
    return other.chainId === this.chainId && other.address === this.address
  }
}

export default Token
