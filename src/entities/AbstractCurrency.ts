import { ChainId, Currency } from '../types'

interface IAbstractCurrency {
  readonly chainId: ChainId
  readonly decimals: number
  readonly symbol: string
  readonly name: string
  readonly logoURI?: string
}

export abstract class AbstractCurrency implements IAbstractCurrency {
  public readonly chainId: ChainId
  public readonly decimals: number
  public readonly symbol: string
  public readonly name: string
  public readonly logoURI?: string
  public abstract readonly isNative: boolean

  protected constructor(chainId: ChainId, decimals: number, symbol: string, name: string, logoURI?: string) {
    /*--- chainId validation ---*/
    if (!Number.isSafeInteger(chainId) || Number.isNaN(Number(chainId))) {
      throw new Error(`Chain id must be a positive integer`)
    }
    // TODO: add supported chainId validation
    /*--- decimals validation ---*/
    if (Number.isNaN(Number(decimals)) || !Number.isInteger(decimals)) {
      throw new Error('Decimals value is invalid. Decimals should be a integer number')
    }
    if (decimals < 0 || decimals > 255) {
      throw new Error(`Decimals should be greater than 0 and less than 255`)
    }
    /*--- symbol validation ---*/
    if (typeof symbol !== 'string') {
      throw new Error(`Symbol should be a string`)
    }
    if (symbol.length < 1) {
      throw new Error(`Min symbol length is 1`)
    }
    if (symbol.length > 20) {
      throw new Error('Max symbol length is 20')
    }
    /*--- name validation ---*/
    if (typeof name !== 'string') {
      throw new Error('Name should be a string')
    }
    if (name.length < 1) {
      throw new Error(`Min name length is 1`)
    }
    if (name.length > 40) {
      throw new Error('Max name length is 40')
    }
    /*--- logoURI validation ---*/
    if (logoURI) {
      try {
        new URL(logoURI)
      } catch (error) {
        throw error
      }
    }

    this.chainId = chainId
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.logoURI = logoURI
  }

  protected abstract equals(other: Currency): boolean
}
