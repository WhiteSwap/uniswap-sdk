import {
  CurrencyAmount,
  Percent,
  Token,
  ChainId,
  NATIVE_CURRENCY,
  SOLIDITY_INTEGER_TYPE_MAXIMA,
  WRAPPED_NATIVE_CURRENCY,
  Fraction
} from '../../src'
import {
  MOCK_ETH_ADDRESS_0,
  MOCK_ZERO_TRC_ADDRESS,
  MOCK_ERC20_TOKEN_0,
  MOCK_ERC20_TOKEN_1,
  MOCK_DAI_MAINNET,
  MOCK_USDC_MAINNET
} from '../__mocks__'
import JSBI from 'jsbi'

describe('CurrencyAmount', () => {
  const token = MOCK_ERC20_TOKEN_0
  const zeroDecimalToken = new Token(ChainId.MAINNET, MOCK_ETH_ADDRESS_0, 0, 'TEST', 'TEST')

  describe('#constructor', () => {
    it('create instance with valid params', () => {
      const amount = new CurrencyAmount(token, 100)
      expect(amount).toBeInstanceOf(CurrencyAmount)
      expect(amount.decimalScale).toEqual(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(token.decimals)))
      expect(amount.currency).toEqual(token)
      expect(amount.quotient).toEqual(JSBI.BigInt(100))
    })
    it('create instance with amount equals to zero', () => {
      const amount = new CurrencyAmount(token, 0)
      expect(amount.quotient).toEqual(JSBI.BigInt(0))
    })
    it('create instance with token amount equals to max uint256', () => {
      const amount = new CurrencyAmount(token, SOLIDITY_INTEGER_TYPE_MAXIMA.uint256)
      expect(amount.quotient).toEqual(SOLIDITY_INTEGER_TYPE_MAXIMA.uint256)
    })
    it('create instance when token amount numerator can be greater uint256 if denominator is greater 1', () => {
      const amount = new CurrencyAmount(token, JSBI.add(SOLIDITY_INTEGER_TYPE_MAXIMA.uint256, JSBI.BigInt(2)), 2)
      expect(amount.numerator).toEqual(JSBI.add(JSBI.BigInt(2), SOLIDITY_INTEGER_TYPE_MAXIMA.uint256))
    })
    it('throw error with amount quotient greater than max uint256', () => {
      expect(() => new CurrencyAmount(token, JSBI.add(SOLIDITY_INTEGER_TYPE_MAXIMA.uint256, JSBI.BigInt(1)))).toThrow()
      expect(() =>
        CurrencyAmount.fromFractionalAmount(
          token,
          JSBI.add(JSBI.multiply(SOLIDITY_INTEGER_TYPE_MAXIMA.uint256, JSBI.BigInt(2)), JSBI.BigInt(2)),
          JSBI.BigInt(2)
        )
      ).toThrow()
    })
    it('throw error with negative amount', () => {
      expect(() => new CurrencyAmount(token, -1)).toThrow()
    })
  })

  describe('#fromRawAmount', () => {
    it('create CurrencyAmount instance with valid numerator', () => {
      const amount = CurrencyAmount.fromRawAmount(token, 100)
      expect(amount).toBeInstanceOf(CurrencyAmount)
      expect(amount.currency).toEqual(token)
      expect(amount.quotient).toEqual(JSBI.BigInt(100))
      expect(amount.numerator).toEqual(JSBI.BigInt(100))
      expect(amount.denominator).toEqual(JSBI.BigInt(1))
    })
  })

  describe('#fromFractionalAmount', () => {
    it('create CurrencyAmount instance with valid fraction', () => {
      const fractionAmount = CurrencyAmount.fromFractionalAmount(token, JSBI.BigInt(100), JSBI.BigInt(10))
      expect(fractionAmount).toBeInstanceOf(CurrencyAmount)
      expect(fractionAmount.currency).toEqual(token)
      expect(fractionAmount.numerator).toEqual(JSBI.BigInt(100))
      expect(fractionAmount.denominator).toEqual(JSBI.BigInt(10))
      expect(fractionAmount.quotient).toEqual(JSBI.BigInt(10))
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

  describe('#quotient', () => {
    it('returns the amount after multiplication', () => {
      const amount = CurrencyAmount.fromRawAmount(token, 100).multiply(new Percent(15, 100))
      expect(amount.quotient).toEqual(JSBI.BigInt(15))
    })
  })

  describe('#add', () => {
    it('return correct amount with equal tokens', () => {
      const amount1 = new CurrencyAmount(token, JSBI.BigInt(100))
      const amount2 = new CurrencyAmount(token, JSBI.BigInt(1))
      const result = amount1.add(amount2)
      expect(result).toBeInstanceOf(CurrencyAmount)
      expect(result.quotient).toEqual(JSBI.BigInt(101))
      expect(result.numerator).toEqual(JSBI.BigInt(101))
      expect(result.denominator).toEqual(JSBI.BigInt(1))
      expect(result.currency).toEqual(token)
    })
    it('return correct amount with equal tokens but one amount represent fraction', () => {
      const amount = new CurrencyAmount(MOCK_ERC20_TOKEN_0, JSBI.BigInt(100))
      const fractionAmount = CurrencyAmount.fromFractionalAmount(MOCK_ERC20_TOKEN_0, JSBI.BigInt(100), JSBI.BigInt(10))
      const result = amount.add(fractionAmount)
      expect(result.quotient).toEqual(JSBI.BigInt(110))
      expect(result.numerator).toEqual(JSBI.BigInt(1100))
      expect(result.denominator).toEqual(JSBI.BigInt(10))
    })
    it('throw error when tokens are not equal', () => {
      const amount1 = new CurrencyAmount(MOCK_ERC20_TOKEN_0, JSBI.BigInt(100))
      const amount2 = new CurrencyAmount(MOCK_ERC20_TOKEN_1, JSBI.BigInt(100))
      expect(() => amount1.add(amount2)).toThrow()
    })
  })

  describe('#subtract', () => {
    it('return correct amount with equal tokens', () => {
      const amount1 = new CurrencyAmount(token, JSBI.BigInt(100))
      const amount2 = new CurrencyAmount(token, JSBI.BigInt(1))
      const result = amount1.subtract(amount2)
      expect(result).toBeInstanceOf(CurrencyAmount)
      expect(result.quotient).toEqual(JSBI.BigInt(99))
      expect(result.numerator).toEqual(JSBI.BigInt(99))
      expect(result.denominator).toEqual(JSBI.BigInt(1))
      expect(result.currency).toEqual(token)
    })
    it('return correct amount with equal tokens but one amount represent fraction', () => {
      const amount = new CurrencyAmount(MOCK_ERC20_TOKEN_0, JSBI.BigInt(100))
      const fractionAmount = CurrencyAmount.fromFractionalAmount(MOCK_ERC20_TOKEN_0, JSBI.BigInt(100), JSBI.BigInt(10))
      const result = amount.subtract(fractionAmount)
      expect(result.quotient).toEqual(JSBI.BigInt(90))
      expect(result.numerator).toEqual(JSBI.BigInt(900))
      expect(result.denominator).toEqual(JSBI.BigInt(10))
    })
    it('throw error when tokens are not equal', () => {
      const amount1 = new CurrencyAmount(MOCK_ERC20_TOKEN_0, JSBI.BigInt(100))
      const amount2 = new CurrencyAmount(MOCK_ERC20_TOKEN_1, JSBI.BigInt(1))
      expect(() => amount1.add(amount2)).toThrow()
    })
  })

  describe('#multiply', () => {
    it('return correct result for multiplying amounts', () => {
      const amount1 = new CurrencyAmount(token, JSBI.BigInt(100))
      const amount2 = new CurrencyAmount(token, JSBI.BigInt(2))
      const result = amount1.multiply(amount2)
      expect(result).toBeInstanceOf(CurrencyAmount)
      expect(result.currency).toEqual(token)
      expect(result.quotient).toEqual(JSBI.BigInt(200))
      expect(result.numerator).toEqual(JSBI.BigInt(200))
      expect(result.denominator).toEqual(JSBI.BigInt(1))
    })
    it('return correct result for multiplying amount and fraction', () => {
      const amount = new CurrencyAmount(token, JSBI.BigInt(100))
      const fraction = new Fraction(JSBI.BigInt(100), JSBI.BigInt(10))
      const result = amount.multiply(fraction)
      expect(result.currency).toEqual(token)
      expect(result.quotient).toEqual(JSBI.BigInt(1000))
      expect(result.numerator).toEqual(JSBI.BigInt(10000))
      expect(result.denominator).toEqual(JSBI.BigInt(10))
    })
    it('return correct amount with different tokens but with same decimals', () => {
      const amount1 = new CurrencyAmount(MOCK_ERC20_TOKEN_0, JSBI.BigInt(100))
      const amount2 = new CurrencyAmount(MOCK_ERC20_TOKEN_1, JSBI.BigInt(200))
      const result = amount1.multiply(amount2)
      expect(result).toBeInstanceOf(CurrencyAmount)
      expect(result.currency).toEqual(MOCK_ERC20_TOKEN_0)
      expect(result.quotient).toEqual(JSBI.BigInt(20000))
      expect(result.numerator).toEqual(JSBI.BigInt(20000))
      expect(result.denominator).toEqual(JSBI.BigInt(1))
    })
    it('return correct amount with different decimals', () => {
      const amount1 = new CurrencyAmount(MOCK_USDC_MAINNET, JSBI.BigInt(100))
      const amount2 = new CurrencyAmount(MOCK_DAI_MAINNET, JSBI.BigInt(2))
      const result = amount1.multiply(amount2)
      expect(result).toBeInstanceOf(CurrencyAmount)
      expect(result.currency).toEqual(MOCK_USDC_MAINNET)
      expect(result.quotient).toEqual(JSBI.BigInt(200))
      expect(result.numerator).toEqual(JSBI.BigInt(200))
      expect(result.denominator).toEqual(JSBI.BigInt(1))
    })
    it('return correct result for multiplying amount and BigIntish', () => {
      const amount = new CurrencyAmount(token, JSBI.BigInt(100))
      const result = amount.multiply(2)
      expect(result).toBeInstanceOf(CurrencyAmount)
      expect(result.currency).toEqual(token)
      expect(result.quotient).toEqual(JSBI.BigInt(200))
      expect(result.numerator).toEqual(JSBI.BigInt(200))
      expect(result.denominator).toEqual(JSBI.BigInt(1))
    })
  })

  describe('#divide', () => {
    it('return correct result for dividing amounts', () => {
      const amount1 = new CurrencyAmount(token, JSBI.BigInt(100))
      const amount2 = new CurrencyAmount(token, JSBI.BigInt(2))
      const result = amount1.divide(amount2)
      expect(result).toBeInstanceOf(CurrencyAmount)
      expect(result.currency).toEqual(token)
      expect(result.quotient).toEqual(JSBI.BigInt(50))
      expect(result.numerator).toEqual(JSBI.BigInt(100))
      expect(result.denominator).toEqual(JSBI.BigInt(2))
    })
    it('return correct result for dividing amount and fraction', () => {
      const amount = new CurrencyAmount(token, JSBI.BigInt(100))
      const fraction = new Fraction(JSBI.BigInt(100), JSBI.BigInt(10))
      const result = amount.divide(fraction)
      expect(result.currency).toEqual(token)
      expect(result.quotient).toEqual(JSBI.BigInt(10))
      expect(result.numerator).toEqual(JSBI.BigInt(1000))
      expect(result.denominator).toEqual(JSBI.BigInt(100))
    })
    it('return correct amount with different tokens but with same decimals', () => {
      const amount1 = new CurrencyAmount(MOCK_ERC20_TOKEN_0, JSBI.BigInt(100))
      const amount2 = new CurrencyAmount(MOCK_ERC20_TOKEN_1, JSBI.BigInt(200))
      const result = amount1.divide(amount2)
      expect(result).toBeInstanceOf(CurrencyAmount)
      expect(result.currency).toEqual(MOCK_ERC20_TOKEN_0)
      expect(result.quotient).toEqual(JSBI.BigInt(0))
      expect(result.numerator).toEqual(JSBI.BigInt(100))
      expect(result.denominator).toEqual(JSBI.BigInt(200))
    })
    it('return correct amount with different decimals', () => {
      const amount1 = new CurrencyAmount(MOCK_USDC_MAINNET, JSBI.BigInt(100))
      const amount2 = new CurrencyAmount(MOCK_DAI_MAINNET, JSBI.BigInt(2))
      const result = amount1.divide(amount2)
      expect(result).toBeInstanceOf(CurrencyAmount)
      expect(result.currency).toEqual(MOCK_USDC_MAINNET)
      expect(result.quotient).toEqual(JSBI.BigInt(50))
      expect(result.numerator).toEqual(JSBI.BigInt(100))
      expect(result.denominator).toEqual(JSBI.BigInt(2))
    })
    it('return correct result for dividing amount and BigIntish', () => {
      const amount = new CurrencyAmount(token, JSBI.BigInt(100))
      const result = amount.divide(2)
      expect(result).toBeInstanceOf(CurrencyAmount)
      expect(result.currency).toEqual(token)
      expect(result.quotient).toEqual(JSBI.BigInt(50))
      expect(result.numerator).toEqual(JSBI.BigInt(100))
      expect(result.denominator).toEqual(JSBI.BigInt(2))
    })
  })

  describe('#ether', () => {
    it('produces ether amount', () => {
      const amount = CurrencyAmount.fromRawAmount(NATIVE_CURRENCY[ChainId.MAINNET], 100)
      expect(amount.quotient).toEqual(JSBI.BigInt(100))
      expect(amount.currency).toEqual(NATIVE_CURRENCY[ChainId.MAINNET])
    })
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
    it('throw error with decimals param > token decimals ', () => {
      const amount = CurrencyAmount.fromRawAmount(token, 1000)
      expect(() => amount.toDecimalPlaces(20)).toThrow()
    })
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
    it('return token amount for non-native currency', () => {
      const amount = CurrencyAmount.fromRawAmount(zeroDecimalToken, 1000)
      expect(amount.wrapped).toEqual(amount)
    })
    it('return wrapped amount for native currency', () => {
      const amount = CurrencyAmount.fromRawAmount(NATIVE_CURRENCY[ChainId.MAINNET], 1000)
      expect(amount.wrapped).toEqual(CurrencyAmount.fromRawAmount(WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET], 1000))
    })
  })
})
