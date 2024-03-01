import JSBI from 'jsbi'
import { ChainId, SolidityType } from '../types'

export const FACTORY_ADDRESS: { [key in ChainId]: string } = {
  [ChainId.MAINNET]: '0x69bd16aE6F507bd3Fc9eCC984d50b04F029EF677',
  [ChainId.GOERLI]: '0x3f0b5743bba8a552a3aa1e7907f4f44047e93f8f',
  [ChainId.POLYGON]: '0x2C46c91b56b273C3067249e91b5AAb5DB1edB920',
  [ChainId.POLYGON_MUMBAI]: '0xC69c2c8bE7B880599eF6764A947841b58700C043',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0x4E3e0f7779E1D4660E343dceA6b3a48b1Ece4791'
}

export const INIT_CODE_HASH = {
  [ChainId.MAINNET]: '0xfad2a9a251fff38151d87d2aa4e39e75ad40feabd873069329d3c31ab9afe018',
  [ChainId.GOERLI]: '0x35d4ee2325cb088a33ff62bba214e18d081ac8c842c7a997520a5bc1ee317b9d',
  [ChainId.POLYGON]: '0x75a509039be29824f374a7d75e939c5a44666139542432e4b192f977a30982b9',
  [ChainId.POLYGON_MUMBAI]: '0x9560bc32bf3c90fe8983c34ddf21cfb2ecb77aead871d2283662075f751deb1f',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0x9560bc32bf3c90fe8983c34ddf21cfb2ecb77aead871d2283662075f751deb1f'
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
