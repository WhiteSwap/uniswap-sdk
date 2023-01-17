import { ChainId, CurrencyAmount, Fraction, Price, Token } from '../../src'
import JSBI from 'jsbi'

describe('Price', () => {
  const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')

  describe('#constructor', () => {
    it('should create Price instance with valid params', () => {
      const price = new Price(USDC, DAI, 1, 54321)
      expect(price.numerator).toEqual(JSBI.BigInt(54321))
      expect(price.denominator).toEqual(JSBI.BigInt(1))
      expect(price.baseCurrency.equals(USDC))
      expect(price.quoteCurrency.equals(DAI))
      expect(price.scalar).toEqual(
        new Fraction(
          JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(USDC.decimals)),
          JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(DAI.decimals))
        )
      )
    })
  })
  describe('#invert', () => {
    it('should change positions of token0 & token1 with amounts', () => {
      const price = new Price(USDC, DAI, 1, 54321)
      expect(price.invert()).toEqual(new Price(DAI, USDC, 54321, 1))
    })
  })
  describe('#multiply', () => {
    it('should fail if multiplying two prices with different base currency', () => {
      const price1 = new Price(USDC, DAI, 5, 20)
      const price2 = new Price(USDT, DAI, 2, 10)
      expect(() => price1.multiply(price2)).toThrowError('TOKEN')
    })
    it('should return correct result after multiplying two prices', () => {
      const price1 = new Price(USDC, DAI, 5, 20)
      const price2 = new Price(DAI, USDT, 2, 10)
      expect(price1.multiply(price2)).toEqual(new Price(USDC, USDT, JSBI.BigInt(10), JSBI.BigInt(200)))
    })
  })

  describe('#quote', () => {
    it('should fail if pass currency differs from base currency', () => {
      const price1 = new Price(USDC, DAI, 5, 20)
      expect(() => price1.quote(CurrencyAmount.fromRawAmount(DAI, 1))).toThrowError('TOKEN')
    })
    it('should returns correct value', () => {
      const price = new Price(USDC, DAI, 1, 5)
      expect(price.quote(CurrencyAmount.fromRawAmount(USDC, 10))).toEqual(CurrencyAmount.fromRawAmount(DAI, 50))
    })
  })

  describe('#toSignificant', () => {
    it('should return correct decimal price result for tokens with same decimals', () => {
      const price = new Price(USDC, USDT, 123, 456)
      expect(price.toSignificant(4)).toEqual('3.707')
    })
    it('should return correct decimal price result for token with different decimals', () => {
      const price = new Price(USDC, DAI, 123, 456)
      expect(price.toSignificant(4)).toEqual('0.000000000003707')
    })
  })

  describe('#toFixed', () => {
    it('should return correct fixed decimal price result for tokens with same decimals', () => {
      const price = new Price(USDC, USDT, 123, 456)
      expect(price.toFixed(4)).toEqual('3.7073')
    })
    it('should return correct fixed decimal price result for token with different decimals', () => {
      const price = new Price(USDC, DAI, 123, 456)
      expect(price.toFixed(4)).toEqual('0.0000')
    })
  })

  describe('#toDecimalPlaces', () => {
    it('should return correct result with decimals with same decimals', () => {
      const price = new Price(USDC, USDT, 123, 456)
      expect(price.toDecimalPlaces()).toEqual('3.707317')
    })
    it('should round decimal price to quoted currency decimals', () => {
      const price = new Price(USDC, DAI, 123, 456)
      expect(price.toDecimalPlaces()).toEqual('0')
    })
  })
  describe('#toExact', () => {
    it('should return exact decimal price with rounding to quoted currency decimals', () => {
      const price = new Price(USDC, DAI, 123, 456)
      expect(price.toExact()).toEqual('0.000000000003707317')
    })
  })
})
