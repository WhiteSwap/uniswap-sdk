import JSBI from 'jsbi'
import { SolidityIntegerType } from '../types'

export const SOLIDITY_INTEGER_TYPE_MAXIMA = {
  [SolidityIntegerType.uint8]: JSBI.BigInt('0xff'),
  [SolidityIntegerType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}
