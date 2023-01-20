import { NativeCurrency, Token } from 'entities'
import JSBI from 'jsbi'
import { NetworkType, Network } from './enums'

export type BigintIsh = JSBI | number | string | boolean | object

export type Currency = NativeCurrency | Token

export type ChainInfo = {
  readonly networkType: NetworkType
  readonly network: Network
}
