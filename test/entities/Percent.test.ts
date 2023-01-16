import { Percent } from '../../src'

describe('Percent', () => {
  describe('#constructor', () => {
    it('should create instances of Percent', () => {
      expect(new Percent(1)).toEqual(new Percent(1, 1))
    })
  })
  describe('#add', () => {
    it('should return correct result after adding percents with equal denominator', () => {
      expect(new Percent(1, 100).add(new Percent(2, 100))).toEqual(new Percent(3, 100))
    })
    it('should return correct result after adding percents with different denominators', () => {
      expect(new Percent(1, 25).add(new Percent(2, 100))).toEqual(new Percent(150, 2500))
    })
  })
  describe('#subtract', () => {
    it('should return correct result after subtract percents with equal denominator', () => {
      expect(new Percent(1, 100).subtract(new Percent(2, 100))).toEqual(new Percent(-1, 100))
    })
    it('should return correct result after subtract percents with different denominator', () => {
      expect(new Percent(1, 25).subtract(new Percent(2, 100))).toEqual(new Percent(50, 2500))
    })
  })
  describe('#multiply', () => {
    it('should return correct percent after multiplying percents', () => {
      expect(new Percent(1, 100).multiply(new Percent(2, 100))).toEqual(new Percent(2, 10000))
    })
  })
  describe('#divide', () => {
    it('should return correct percent after dividing percents', () => {
      expect(new Percent(1, 100).divide(new Percent(2, 100))).toEqual(new Percent(100, 200))
    })
  })
  describe('#toSignificant', () => {
    it('should returns the value scaled by 100', () => {
      expect(new Percent(154, 10_000).toSignificant(3)).toEqual('1.54')
    })
  })
  describe('#toFixed', () => {
    it('should returns the value scaled by 100', () => {
      expect(new Percent(154, 10_000).toFixed(2)).toEqual('1.54')
    })
  })
  describe('#toDecimalPlaces', () => {
    it('should return correct decimal part', () => {
      expect(new Percent(154123452, 100000).toDecimalPlaces()).toEqual('154123.45')
    })
  })
})
