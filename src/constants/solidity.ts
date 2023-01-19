import JSBI from 'jsbi'
import { SolidityIntegerType } from '../types'

export const SOLIDITY_INTEGER_TYPE_MAXIMA = {
  [SolidityIntegerType.uint8]: JSBI.BigInt('0xff'),
  [SolidityIntegerType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}

export const TRON_ADDRESS_PREFIX = '41'
export const TRON_ADDRESS_PREFIX_BYTE = 0x41
export const TRON_ADDRESS_PREFIX_REGEX = /^(41)/
