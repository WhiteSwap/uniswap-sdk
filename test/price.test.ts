import JSBI from 'jsbi'
import { ChainId, Price, Token, WRAPPED_NATIVE_CURRENCY } from '../src'

describe('Price', () => {
  const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
  const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  const USDT = new Token(ChainId.MAINNET, '0xdac17f958d2ee523a2206206994597c13d831ec7', 6, 'USDT', 'Tether')
  const daiUsdcPrice = new Price(DAI, USDC, JSBI.BigInt(1000), JSBI.BigInt(1234))
  const usdtWethPrice = new Price(
    USDT,
    WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET],
    JSBI.BigInt(1000000000),
    JSBI.BigInt(1234567890123456789122)
  )

  describe('#toDecimalPlaces', () => {
    it('should round price to default decimals', () => {
      expect(daiUsdcPrice.toDecimalPlaces()).toEqual('1.234')
    })
    it('should round price to specified decimals', () => {
      expect(daiUsdcPrice.toDecimalPlaces(2)).toEqual('1.23')
    })
    it('should round price to quotient currency', () => {
      expect(usdtWethPrice.toDecimalPlaces()).toEqual('1.234568')
    })
    it('should round price to inverted quotient currency', () => {
      expect(usdtWethPrice.invert().toDecimalPlaces()).toEqual('0.81000001')
    })
    it('should return exact price to inverted quotient currency', () => {
      expect(usdtWethPrice.invert().toExact()).toEqual('0.810000007290000076')
    })
    it('should return exact price to quotient currency', () => {
      expect(usdtWethPrice.toExact()).toEqual('1.234568')
    })
  })
})
