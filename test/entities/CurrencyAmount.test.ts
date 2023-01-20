import { CurrencyAmount, Percent, Token, ChainId, NATIVE_CURRENCY, SOLIDITY_INTEGER_TYPE_MAXIMA, WRAPPED_NATIVE_CURRENCY } from '../../src'
import { MOCK_ETH_ADDRESS_0, MOCK_ZERO_TRC_ADDRESS, MOCK_ERC20_TOKEN_0 } from '../__mocks__'
import JSBI from 'jsbi'

describe('CurrencyAmount', () => {
  const token = MOCK_ERC20_TOKEN_0
  const zeroDecimalToken = new Token(ChainId.MAINNET, MOCK_ETH_ADDRESS_0, 0, 'TEST', 'TEST')

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
    expect(() => CurrencyAmount.fromRawAmount(token, JSBI.add(SOLIDITY_INTEGER_TYPE_MAXIMA.uint256, JSBI.BigInt(1)))).toThrow()
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
    const amount = CurrencyAmount.fromFractionalAmount(token, JSBI.add(SOLIDITY_INTEGER_TYPE_MAXIMA.uint256, JSBI.BigInt(2)), 2)
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
      const amount = CurrencyAmount.fromRawAmount(zeroDecimalToken, 1000)
      expect(amount.wrapped).toEqual(amount)
    })
    it('should return wrapped amount for native currency', () => {
      const amount = CurrencyAmount.fromRawAmount(NATIVE_CURRENCY[ChainId.MAINNET], 1000)
      expect(amount.wrapped).toEqual(CurrencyAmount.fromFractionalAmount(WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET], 1000, 1))
    })
  })
  describe('#fromFloatAmount', () => {
    it('correct convert float amount to erc20 token', () => {
      const tokenDecimal18 = new Token(ChainId.MAINNET, MOCK_ETH_ADDRESS_0, 18, 'test', 'test')
      const tokenDecimal6 = new Token(ChainId.MAINNET, MOCK_ETH_ADDRESS_0, 6, 'test1', 'test1')
      const tokenDecimal4 = new Token(ChainId.MAINNET, MOCK_ETH_ADDRESS_0, 4, 'test2', 'test2')

      expect(CurrencyAmount.fromFloatAmount('1.23', tokenDecimal18)).toEqual(
        CurrencyAmount.fromRawAmount(tokenDecimal18, 1230000000000000000)
      )
      expect(CurrencyAmount.fromFloatAmount('1.23', tokenDecimal6)).toEqual(CurrencyAmount.fromRawAmount(tokenDecimal6, 1230000))
      expect(CurrencyAmount.fromFloatAmount('1.23', tokenDecimal4)).toEqual(CurrencyAmount.fromRawAmount(tokenDecimal4, 12300))
    })
    it('correct convert float amount to trc20 token', () => {
      const tokenDecimal18 = new Token(ChainId.MAINNET_TRON_GRID, MOCK_ZERO_TRC_ADDRESS, 18, 'test', 'test')
      const tokenDecimal6 = new Token(ChainId.MAINNET_TRON_GRID, MOCK_ZERO_TRC_ADDRESS, 6, 'test1', 'test1')
      const tokenDecimal4 = new Token(ChainId.MAINNET_TRON_GRID, MOCK_ZERO_TRC_ADDRESS, 4, 'test2', 'test2')

      expect(CurrencyAmount.fromFloatAmount('1.23', tokenDecimal18)).toEqual(
        CurrencyAmount.fromRawAmount(tokenDecimal18, 1230000000000000000)
      )
      expect(CurrencyAmount.fromFloatAmount('1.23', tokenDecimal6)).toEqual(CurrencyAmount.fromRawAmount(tokenDecimal6, 1230000))
      expect(CurrencyAmount.fromFloatAmount('1.23', tokenDecimal4)).toEqual(CurrencyAmount.fromRawAmount(tokenDecimal4, 12300))
    })
    it('throw error with invalid amount', () => {
      expect(() => CurrencyAmount.fromFloatAmount('<1.23', token)).toThrow()
    })
    it('throw error with decimals part equal to 1', () => {
      const invalidToken = new Token(ChainId.MAINNET, MOCK_ETH_ADDRESS_0, 1, 'test', 'test')
      expect(() => CurrencyAmount.fromFloatAmount('1.23', invalidToken)).toThrow()
    })
  })
})
