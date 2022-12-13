import JSBI from 'jsbi'
import { ChainId, Price, Token } from '../src'

describe('Price', () => {
  const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
  const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  const amount = JSBI.BigInt(1234)

  describe('#toDecimalPlaces', () => {
    it('should round price to default decimals', () => {
      expect(new Price(DAI, USDC, JSBI.BigInt(1000), amount).toDecimalPlaces()).toEqual('1.234')
    })
    it('should round price to specified decimals', () => {
      expect(new Price(DAI, USDC, JSBI.BigInt(1000), amount).toDecimalPlaces(2)).toEqual('1.23')
    })
  })
})
