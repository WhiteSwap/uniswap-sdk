import JSBI from 'jsbi'
import { ChainId, Token, TokenAmount } from '../src'

describe('TokenAmount', () => {
  const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'
  const amount = JSBI.BigInt(123451231234)

  describe('#toDecimalPlaces', () => {
    it('should format amount to default token decimals', () => {
      expect(new TokenAmount(new Token(ChainId.MAINNET, ADDRESS_ONE, 6), amount).toDecimalPlaces()).toEqual(
        '123451.231234'
      )
    })
    it('should format to default decimals if token decimals greater than default amount', () => {
      expect(new TokenAmount(new Token(ChainId.MAINNET, ADDRESS_ONE, 18), amount).toDecimalPlaces()).toEqual(
        '0.00000012'
      )
    })
    it('should format amount with decimal less than token decimals', () => {
      expect(new TokenAmount(new Token(ChainId.MAINNET, ADDRESS_ONE, 6), amount).toDecimalPlaces(2)).toEqual(
        '123451.23'
      )
    })
    it('should format amount with comma separator', () => {
      expect(
        new TokenAmount(new Token(ChainId.MAINNET, ADDRESS_ONE, 4), amount).toDecimalPlaces(4, {
          groupSeparator: ','
        })
      ).toEqual('12,345,123.1234')
    })
    it('should fail with decimals bigger than currency decimals', () => {
      try {
        new TokenAmount(new Token(ChainId.MAINNET, ADDRESS_ONE, 6), amount).toDecimalPlaces(8)
      } catch (error) {
        expect((error as Error).message).toEqual(
          'Invariant failed: decimalsPlaces param must be less or equal to token decimals. Received: 8, currency decimals: 6'
        )
      }
    })
  })
})
