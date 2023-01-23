import JSBI from 'jsbi'
import { SolidityIntegerType } from '../types'
import { validateSolidityIntegerType } from './validateSolidityIntegerType'
import { ONE, THREE, TWO, ZERO } from '../constants'

// mock the on-chain sqrt function
export function sqrt(y: JSBI): JSBI {
  validateSolidityIntegerType(y, SolidityIntegerType.uint256)

  let z: JSBI = ZERO
  let x: JSBI
  if (JSBI.greaterThan(y, THREE)) {
    z = y
    x = JSBI.add(JSBI.divide(y, TWO), ONE)
    while (JSBI.lessThan(x, z)) {
      z = x
      x = JSBI.divide(JSBI.add(JSBI.divide(y, x), x), TWO)
    }
  } else if (JSBI.notEqual(y, ZERO)) {
    z = ONE
  }
  return z
}
