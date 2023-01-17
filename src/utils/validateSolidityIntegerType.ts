import { SOLIDITY_INTEGER_TYPE_MAXIMA, ZERO } from '../constants/index'
import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { SolidityIntegerType } from '../types'

export function validateSolidityIntegerType(value: JSBI, solidityType: SolidityIntegerType): void {
  invariant(JSBI.greaterThanOrEqual(value, ZERO), `${value} is not a ${solidityType}.`)
  invariant(JSBI.lessThanOrEqual(value, SOLIDITY_INTEGER_TYPE_MAXIMA[solidityType]), `${value} is not a ${solidityType}.`)
}
