import { ChainId } from 'types'

export default interface IAbstractCurrency {
  readonly chainId: ChainId
  readonly decimals: number
  readonly symbol: string
  readonly name: string
  readonly logoURI?: string
}
