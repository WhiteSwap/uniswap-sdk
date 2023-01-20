import { CurrencyAmount, Fraction, Price } from '../../src'
import JSBI from 'jsbi'
import { MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, MOCK_USDT_MAINNET } from '../__mocks__'

describe('Price', () => {
  describe('#constructor', () => {
    it('should create Price instance with valid params', () => {
      const price = new Price(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, 1, 54321)
      expect(price.numerator).toEqual(JSBI.BigInt(54321))
      expect(price.denominator).toEqual(JSBI.BigInt(1))
      expect(price.baseCurrency.equals(MOCK_USDC_MAINNET))
      expect(price.quoteCurrency.equals(MOCK_DAI_MAINNET))
      expect(price.scalar).toEqual(
        new Fraction(
          JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(MOCK_USDC_MAINNET.decimals)),
          JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(MOCK_DAI_MAINNET.decimals))
        )
      )
    })
  })
  describe('#invert', () => {
    it('should change positions of token0 & token1 with amounts', () => {
      const price = new Price(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, 1, 54321)
      expect(price.invert()).toEqual(new Price(MOCK_DAI_MAINNET, MOCK_USDC_MAINNET, 54321, 1))
    })
  })
  describe('#multiply', () => {
    it('should fail if multiplying two prices with different base currency', () => {
      const price1 = new Price(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, 5, 20)
      const price2 = new Price(MOCK_USDT_MAINNET, MOCK_DAI_MAINNET, 2, 10)
      expect(() => price1.multiply(price2)).toThrowError('TOKEN')
    })
    it('should return correct result after multiplying two prices', () => {
      const price1 = new Price(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, 5, 20)
      const price2 = new Price(MOCK_DAI_MAINNET, MOCK_USDT_MAINNET, 2, 10)
      expect(price1.multiply(price2)).toEqual(new Price(MOCK_USDC_MAINNET, MOCK_USDT_MAINNET, JSBI.BigInt(10), JSBI.BigInt(200)))
    })
  })

  describe('#quote', () => {
    it('should fail if pass currency differs from base currency', () => {
      const price1 = new Price(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, 5, 20)
      expect(() => price1.quote(CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, 1))).toThrowError('TOKEN')
    })
    it('should returns correct value', () => {
      const price = new Price(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, 1, 5)
      expect(price.quote(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, 10))).toEqual(CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, 50))
    })
  })

  describe('#toSignificant', () => {
    it('should return correct decimal price result for tokens with same decimals', () => {
      const price = new Price(MOCK_USDC_MAINNET, MOCK_USDT_MAINNET, 123, 456)
      expect(price.toSignificant(4)).toEqual('3.707')
    })
    it('should return correct decimal price result for token with different decimals', () => {
      const price = new Price(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, 123, 456)
      expect(price.toSignificant(4)).toEqual('0.000000000003707')
    })
  })

  describe('#toFixed', () => {
    it('should return correct fixed decimal price result for tokens with same decimals', () => {
      const price = new Price(MOCK_USDC_MAINNET, MOCK_USDT_MAINNET, 123, 456)
      expect(price.toFixed(4)).toEqual('3.7073')
    })
    it('should return correct fixed decimal price result for token with different decimals', () => {
      const price = new Price(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, 123, 456)
      expect(price.toFixed(4)).toEqual('0.0000')
    })
  })

  describe('#toDecimalPlaces', () => {
    it('should return correct result with decimals with same decimals', () => {
      const price = new Price(MOCK_USDC_MAINNET, MOCK_USDT_MAINNET, 123, 456)
      expect(price.toDecimalPlaces()).toEqual('3.707317')
    })
    it('should round decimal price to quoted currency decimals', () => {
      const price = new Price(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, 123, 456)
      expect(price.toDecimalPlaces()).toEqual('0')
    })
  })
  describe('#toExact', () => {
    it('should return exact decimal price with rounding to quoted currency decimals', () => {
      const price = new Price(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, 123, 456)
      expect(price.toExact()).toEqual('0.000000000003707317')
    })
  })
})
