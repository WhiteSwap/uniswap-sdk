import JSBI from 'jsbi'
import { ChainId, SolidityType } from '../types'

export const FACTORY_ADDRESS: { [key: number]: string } = {
  [ChainId.MAINNET]: '0x69bd16aE6F507bd3Fc9eCC984d50b04F029EF677',
  [ChainId.ROPSTEN]: '0x69bd16aE6F507bd3Fc9eCC984d50b04F029EF677',
  [ChainId.RINKEBY]: '0x69bd16aE6F507bd3Fc9eCC984d50b04F029EF677',
  [ChainId.GOERLI]: '0x69bd16aE6F507bd3Fc9eCC984d50b04F029EF677',
  [ChainId.KOVAN]: '0x69bd16aE6F507bd3Fc9eCC984d50b04F029EF677',
  [ChainId.POLYGON]: '',
  [ChainId.POLYGON_MUMBAI]: '0x5757371414417b8c6caad45baef941abc7d3ab32'
}

export const INIT_CODE_HASH = '0xfad2a9a251fff38151d87d2aa4e39e75ad40feabd873069329d3c31ab9afe018'

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}
