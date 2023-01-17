import {
  CurrencyAmount,
  Percent,
  Token,
  ChainId,
  NATIVE_CURRENCY,
  SOLIDITY_INTEGER_TYPE_MAXIMA,
  WRAPPED_NATIVE_CURRENCY
} from '../../src'
import JSBI from 'jsbi'

describe('CurrencyAmount', () => {
  const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'
  const token = new Token(ChainId.MAINNET, ADDRESS_ONE, 18, 'TEST', 'TEST')
  const zeroDecimalToken = new Token(ChainId.MAINNET, ADDRESS_ONE, 0, 'TEST', 'TEST')

  describe('#constructor', () => {
    it('should create instance', () => {
      const amount = CurrencyAmount.fromRawAmount(token, 100)
      expect(amount).toBeInstanceOf(CurrencyAmount)
      expect(amount.decimalScale).toEqual(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(token.decimals)))
      expect(amount.currency).toEqual(token)
      expect(amount.quotient).toEqual(JSBI.BigInt(100))
    })
  })

  describe('#quotient', () => {
    it('returns the amount after multiplication', () => {
      const amount = CurrencyAmount.fromRawAmount(token, 100).multiply(new Percent(15, 100))
      expect(amount.quotient).toEqual(JSBI.BigInt(15))
    })
  })

  describe('#ether', () => {
    it('produces ether amount', () => {
      const amount = CurrencyAmount.fromRawAmount(NATIVE_CURRENCY[ChainId.MAINNET], 100)
      expect(amount.quotient).toEqual(JSBI.BigInt(100))
      expect(amount.currency).toEqual(NATIVE_CURRENCY[ChainId.MAINNET])
    })
  })

  it('token amount cannot exceed max uint256', () => {
    expect(() =>
      CurrencyAmount.fromRawAmount(token, JSBI.add(SOLIDITY_INTEGER_TYPE_MAXIMA.uint256, JSBI.BigInt(1)))
    ).toThrow()
  })
  it('token amount quotient cannot exceed max uint256', () => {
    expect(() =>
      CurrencyAmount.fromFractionalAmount(
        token,
        JSBI.add(JSBI.multiply(SOLIDITY_INTEGER_TYPE_MAXIMA.uint256, JSBI.BigInt(2)), JSBI.BigInt(2)),
        JSBI.BigInt(2)
      )
    ).toThrow()
  })
  it('token amount can be max uint256', () => {
    const amount = CurrencyAmount.fromRawAmount(token, SOLIDITY_INTEGER_TYPE_MAXIMA.uint256)
    expect(amount.quotient).toEqual(SOLIDITY_INTEGER_TYPE_MAXIMA.uint256)
  })
  it('token amount numerator can be greater uint256 if denominator is greater 1', () => {
    const amount = CurrencyAmount.fromFractionalAmount(
      token,
      JSBI.add(SOLIDITY_INTEGER_TYPE_MAXIMA.uint256, JSBI.BigInt(2)),
      2
    )
    expect(amount.numerator).toEqual(JSBI.add(JSBI.BigInt(2), SOLIDITY_INTEGER_TYPE_MAXIMA.uint256))
  })

  describe('#toFixed', () => {
    it('throws for decimals > currency.decimals', () => {
      const amount = CurrencyAmount.fromRawAmount(zeroDecimalToken, 1000)
      expect(() => amount.toFixed(3)).toThrow('DECIMALS')
    })
    it('is correct for 0 decimals', () => {
      const amount = CurrencyAmount.fromRawAmount(zeroDecimalToken, 123456)
      expect(amount.toFixed(0)).toEqual('123456')
    })
    it('is correct for 18 decimals', () => {
      const amount = CurrencyAmount.fromRawAmount(token, 1e15)
      expect(amount.toFixed(9)).toEqual('0.001000000')
    })
  })

  describe('#toSignificant', () => {
    it('does not throw for sig figs > currency.decimals', () => {
      const amount = CurrencyAmount.fromRawAmount(zeroDecimalToken, 1000)
      expect(amount.toSignificant(3)).toEqual('1000')
    })
    it('is correct for 0 decimals', () => {
      const amount = CurrencyAmount.fromRawAmount(zeroDecimalToken, 123456)
      expect(amount.toSignificant(4)).toEqual('123400')
    })
    it('is correct for 18 decimals', () => {
      const amount = CurrencyAmount.fromRawAmount(token, 1e15)
      expect(amount.toSignificant(9)).toEqual('0.001')
    })
  })

  describe('#toExact', () => {
    it('does not throw for sig figs > currency.decimals', () => {
      const amount = CurrencyAmount.fromRawAmount(zeroDecimalToken, 1000)
      expect(amount.toExact()).toEqual('1000')
    })
    it('is correct for 0 decimals', () => {
      const amount = CurrencyAmount.fromRawAmount(zeroDecimalToken, 123456)
      expect(amount.toExact()).toEqual('123456')
    })
    it('is correct for 18 decimals', () => {
      const amount = CurrencyAmount.fromRawAmount(token, 123e13)
      expect(amount.toExact()).toEqual('0.00123')
    })
  })
  describe('#toDecimalPlaces', () => {
    it('does not throw for sig figs > currency.decimals', () => {
      const amount = CurrencyAmount.fromRawAmount(zeroDecimalToken, 1000)
      expect(amount.toDecimalPlaces()).toEqual('1000')
    })
    it('is correct for 0 decimals', () => {
      const amount = CurrencyAmount.fromRawAmount(zeroDecimalToken, 123456)
      expect(amount.toDecimalPlaces()).toEqual('123456')
    })
    it('is correct for 18 decimals', () => {
      const amount = CurrencyAmount.fromRawAmount(token, 1234567890123456789012345)
      expect(amount.toDecimalPlaces()).toEqual('1234567.89012345')
    })
  })
  describe('#wrapped', () => {
    it('should return amount for current token', () => {
      const token = new Token(ChainId.MAINNET, ADDRESS_ONE, 0, 'TEST', 'TEST')
      const amount = CurrencyAmount.fromRawAmount(token, 1000)
      expect(amount.wrapped).toEqual(amount)
    })
    it('should return wrapped amount for native currency', () => {
      const amount = CurrencyAmount.fromRawAmount(NATIVE_CURRENCY[ChainId.MAINNET], 1000)
      expect(amount.wrapped).toEqual(
        CurrencyAmount.fromFractionalAmount(WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET], 1000, 1)
      )
    })
  })
})
