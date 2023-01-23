import JSBI from 'jsbi'
import { SOLIDITY_INTEGER_TYPE_MAXIMA } from '../../src'
import { sqrt } from '../../src/utils'

describe('#sqrt', () => {
  it('correct for 0-1000', () => {
    for (let i = 0; i < 1000; i++) {
      expect(sqrt(JSBI.BigInt(i))).toEqual(JSBI.BigInt(Math.floor(Math.sqrt(i))))
    }
  })
  it('throw error for negative number', () => {
    expect(() => sqrt(JSBI.BigInt(-10))).toThrow()
  })

  it('throw error for number greater than  max uint256', () => {
    const value = JSBI.multiply(SOLIDITY_INTEGER_TYPE_MAXIMA.uint256, SOLIDITY_INTEGER_TYPE_MAXIMA.uint256)
    expect(() => sqrt(value)).toThrow()
  })

  it('correct for all even powers of 2', () => {
    for (let i = 0; i < 128; i++) {
      const root = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(i))
      const rootSquared = JSBI.multiply(root, root)
      expect(sqrt(rootSquared)).toEqual(root)
    }
  })

  it('correct for MaxUint256', () => {
    expect(sqrt(SOLIDITY_INTEGER_TYPE_MAXIMA.uint256)).toEqual(JSBI.BigInt('340282366920938463463374607431768211455'))
  })

  it('correct for MaxUint8', () => {
    expect(sqrt(SOLIDITY_INTEGER_TYPE_MAXIMA.uint8)).toEqual(JSBI.BigInt('15'))
  })
})
