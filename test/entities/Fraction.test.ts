import { Fraction } from '../../src'
import JSBI from 'jsbi'

describe('Fraction', () => {
  describe('#constructor', () => {
    it('should create instance of Fraction', () => {
      expect(new Fraction(1, 2)).toBeInstanceOf(Fraction)
    })
    it('should fail to create instance with invalid numbers', () => {
      expect(() => new Fraction('testNum', 'testNum')).toThrowError('Cannot convert testNum to a BigInt')
    })
  })
  describe('#quotient', () => {
    it('should return correct quotient after floor division', () => {
      expect(new Fraction(JSBI.BigInt(8), JSBI.BigInt(3)).quotient).toEqual(JSBI.BigInt(2)) // one below
      expect(new Fraction(JSBI.BigInt(12), JSBI.BigInt(4)).quotient).toEqual(JSBI.BigInt(3)) // exact
      expect(new Fraction(JSBI.BigInt(16), JSBI.BigInt(5)).quotient).toEqual(JSBI.BigInt(3)) // one above
    })
  })
  describe('#remainder', () => {
    it('should returns fraction after division', () => {
      expect(new Fraction(JSBI.BigInt(8), JSBI.BigInt(3)).remainder).toEqual(
        new Fraction(JSBI.BigInt(2), JSBI.BigInt(3))
      )
      expect(new Fraction(JSBI.BigInt(12), JSBI.BigInt(4)).remainder).toEqual(
        new Fraction(JSBI.BigInt(0), JSBI.BigInt(4))
      )
      expect(new Fraction(JSBI.BigInt(16), JSBI.BigInt(5)).remainder).toEqual(
        new Fraction(JSBI.BigInt(1), JSBI.BigInt(5))
      )
    })
  })
  describe('#invert', () => {
    it('should flips numerator and denominator', () => {
      expect(new Fraction(JSBI.BigInt(5), JSBI.BigInt(10)).invert().numerator).toEqual(JSBI.BigInt(10))
      expect(new Fraction(JSBI.BigInt(5), JSBI.BigInt(10)).invert().denominator).toEqual(JSBI.BigInt(5))
    })
  })
  describe('#add', () => {
    it('should multiples denominators and adds numerators', () => {
      expect(new Fraction(JSBI.BigInt(1), JSBI.BigInt(10)).add(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))).toEqual(
        new Fraction(JSBI.BigInt(52), JSBI.BigInt(120))
      )
    })

    it('should return same denominator after adding fraction with same denominator', () => {
      expect(new Fraction(JSBI.BigInt(1), JSBI.BigInt(5)).add(new Fraction(JSBI.BigInt(2), JSBI.BigInt(5)))).toEqual(
        new Fraction(JSBI.BigInt(3), JSBI.BigInt(5))
      )
    })
  })
  describe('#subtract', () => {
    it('should multiples denominators and subtracts numerators', () => {
      expect(
        new Fraction(JSBI.BigInt(1), JSBI.BigInt(10)).subtract(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))
      ).toEqual(new Fraction(JSBI.BigInt(-28), JSBI.BigInt(120)))
    })
    it('should return same denominator after subtract fraction with same denominator', () => {
      expect(
        new Fraction(JSBI.BigInt(3), JSBI.BigInt(5)).subtract(new Fraction(JSBI.BigInt(2), JSBI.BigInt(5)))
      ).toEqual(new Fraction(JSBI.BigInt(1), JSBI.BigInt(5)))
    })
  })
  describe('#lessThan', () => {
    it('should return correct boolean value', () => {
      expect(
        new Fraction(JSBI.BigInt(1), JSBI.BigInt(10)).lessThan(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))
      ).toBe(true)
      expect(new Fraction(JSBI.BigInt(1), JSBI.BigInt(3)).lessThan(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))).toBe(
        false
      )
      expect(
        new Fraction(JSBI.BigInt(5), JSBI.BigInt(12)).lessThan(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))
      ).toBe(false)
    })
  })
  describe('#equalTo', () => {
    it('should return true for equal fractions', () => {
      expect(new Fraction(JSBI.BigInt(1), JSBI.BigInt(10)).equalTo(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))).toBe(
        false
      )
      expect(new Fraction(JSBI.BigInt(1), JSBI.BigInt(3)).equalTo(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))).toBe(
        true
      )
      expect(new Fraction(JSBI.BigInt(5), JSBI.BigInt(12)).equalTo(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))).toBe(
        false
      )
    })
  })
  describe('#greaterThan', () => {
    it('should return correct boolean value', () => {
      expect(
        new Fraction(JSBI.BigInt(1), JSBI.BigInt(10)).greaterThan(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))
      ).toBe(false)
      expect(
        new Fraction(JSBI.BigInt(1), JSBI.BigInt(3)).greaterThan(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))
      ).toBe(false)
      expect(
        new Fraction(JSBI.BigInt(5), JSBI.BigInt(12)).greaterThan(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))
      ).toBe(true)
    })
  })
  describe('#multiplty', () => {
    it('should return correct result after multiplying fractions', () => {
      expect(
        new Fraction(JSBI.BigInt(1), JSBI.BigInt(10)).multiply(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))
      ).toEqual(new Fraction(JSBI.BigInt(4), JSBI.BigInt(120)))
      expect(
        new Fraction(JSBI.BigInt(1), JSBI.BigInt(3)).multiply(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))
      ).toEqual(new Fraction(JSBI.BigInt(4), JSBI.BigInt(36)))
      expect(
        new Fraction(JSBI.BigInt(5), JSBI.BigInt(12)).multiply(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))
      ).toEqual(new Fraction(JSBI.BigInt(20), JSBI.BigInt(144)))
    })
  })
  describe('#divide', () => {
    it('should return correct result after dividing fractions', () => {
      expect(
        new Fraction(JSBI.BigInt(1), JSBI.BigInt(10)).divide(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))
      ).toEqual(new Fraction(JSBI.BigInt(12), JSBI.BigInt(40)))
      expect(
        new Fraction(JSBI.BigInt(1), JSBI.BigInt(3)).divide(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))
      ).toEqual(new Fraction(JSBI.BigInt(12), JSBI.BigInt(12)))
      expect(
        new Fraction(JSBI.BigInt(5), JSBI.BigInt(12)).divide(new Fraction(JSBI.BigInt(4), JSBI.BigInt(12)))
      ).toEqual(new Fraction(JSBI.BigInt(60), JSBI.BigInt(48)))
    })
  })
})
