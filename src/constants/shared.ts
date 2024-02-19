import JSBI from 'jsbi'
import { ChainId, SolidityType } from '../types'

export const FACTORY_ADDRESS: { [key in ChainId]: string } = {
  [ChainId.MAINNET]: '0x69bd16aE6F507bd3Fc9eCC984d50b04F029EF677',
  [ChainId.GOERLI]: '0x3f0b5743bba8a552a3aa1e7907f4f44047e93f8f',
  [ChainId.POLYGON]: '0x2C46c91b56b273C3067249e91b5AAb5DB1edB920',
  [ChainId.POLYGON_MUMBAI]: '0x9E4f31774478bC3D2c4964A4aDd623ec64D60d0B',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0x50c5aE87e5484CC0AD2B0e63d88d6d22500DC8a3'
}

export const INIT_CODE_HASH = {
  [ChainId.MAINNET]: '0xfad2a9a251fff38151d87d2aa4e39e75ad40feabd873069329d3c31ab9afe018',
  [ChainId.GOERLI]: '0x35d4ee2325cb088a33ff62bba214e18d081ac8c842c7a997520a5bc1ee317b9d',
  [ChainId.POLYGON]: '0x75a509039be29824f374a7d75e939c5a44666139542432e4b192f977a30982b9',
  [ChainId.POLYGON_MUMBAI]: '0x3f0f378c8f9a970327a72bc103c921f017e55c72db22529f07bcf6266153706c',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0xd767a0000fece3e08079a2c51f88dc2c670f814f08329010824dcc8d89413ef2'
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
