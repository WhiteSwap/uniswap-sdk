import JSBI from 'jsbi'
import { ChainId, SolidityType } from '../types'

export const FACTORY_ADDRESS: { [key in ChainId]: string } = {
  [ChainId.MAINNET]: '0x69bd16aE6F507bd3Fc9eCC984d50b04F029EF677',
  [ChainId.GOERLI]: '0x3f0b5743bba8a552a3aa1e7907f4f44047e93f8f',
  [ChainId.POLYGON]: '0x3f0b5743bba8a552a3aa1e7907f4f44047e93f8f',
  [ChainId.POLYGON_MUMBAI]: '0x3f0b5743bba8a552a3aa1e7907f4f44047e93f8f'
}

export const INIT_CODE_HASH = {
  [ChainId.MAINNET]: '0xfad2a9a251fff38151d87d2aa4e39e75ad40feabd873069329d3c31ab9afe018',
  [ChainId.GOERLI]: '0x35d4ee2325cb088a33ff62bba214e18d081ac8c842c7a997520a5bc1ee317b9d',
  [ChainId.POLYGON]: '0x7191ce262e831732e5124709cc335a6f0586f035789478995da659d8cb14a8fd',
  [ChainId.POLYGON_MUMBAI]: '0x7191ce262e831732e5124709cc335a6f0586f035789478995da659d8cb14a8fd'
}

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

export const MAX_DECIMAL_PLACES = 8

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}
