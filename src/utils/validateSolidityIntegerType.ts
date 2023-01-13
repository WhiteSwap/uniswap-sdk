import { ZERO, SOLIDITY_TYPE_MAXIMA } from 'constants/index'
import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { SolidityIntegerType } from 'types'

export function validateSolidityIntegerType(value: JSBI, solidityType: SolidityIntegerType): void {
  invariant(JSBI.greaterThanOrEqual(value, ZERO), `${value} is not a ${solidityType}.`)
  invariant(JSBI.lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType]), `${value} is not a ${solidityType}.`)
}
