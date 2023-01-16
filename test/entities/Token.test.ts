import { ChainId, NativeCurrency, Token } from '../../src'

describe('Token', () => {
  const ERC20_ZERO_ADDRESS = '0x0000000000000000000000000000000000000001'
  const ERC20_ZERO_ADDRESS_TWO = '0x0000000000000000000000000000000000000002'
  const TRC20_ZERO_ADDRESS = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb'

  describe('#constructor', () => {
    it('should create ERC20 instance', () => {
      const token = new Token(ChainId.MAINNET, ERC20_ZERO_ADDRESS, 6, 'TESTTOKEN', 'TESTTOKEN')
      expect(token).toBeInstanceOf(Token)
    })
    it('should create TRC20 instance', () => {
      const token = new Token(ChainId.MAINNET_TRON_GRID, TRC20_ZERO_ADDRESS, 6, 'TESTTOKEN', 'TESTTOKEN')
      expect(token).toBeInstanceOf(Token)
    })
    it('should fail to create ERC20 instance with TRC20 address', () => {
      expect(() => new Token(ChainId.MAINNET, TRC20_ZERO_ADDRESS, 6, 'TESTTOKEN', 'TESTTOKEN')).toThrowError(
        `Address: ${TRC20_ZERO_ADDRESS} is invalid for chainId: ${ChainId.MAINNET}`
      )
    })
    it('should fail to create TRC20 instance with ERC20 address', () => {
      expect(() => new Token(ChainId.MAINNET_TRON_GRID, ERC20_ZERO_ADDRESS, 6, 'TESTTOKEN', 'TESTTOKEN')).toThrowError(
        `Address: ${ERC20_ZERO_ADDRESS} is invalid for chainId: ${ChainId.MAINNET_TRON_GRID}`
      )
    })
  })
  describe('#equals', () => {
    const token = new Token(ChainId.MAINNET, ERC20_ZERO_ADDRESS, 18, 'TEST', 'TEST')

    it('should return false if addresses differ', () => {
      const tokenTwo = new Token(ChainId.MAINNET, ERC20_ZERO_ADDRESS_TWO, 18, 'TEST', 'TEST')
      expect(token.equals(tokenTwo)).toBeFalsy()
    })

    it('should return false if chain id differs', () => {
      const tokenTwo = new Token(ChainId.GOERLI, ERC20_ZERO_ADDRESS_TWO, 18, 'TEST', 'TEST')
      expect(token.equals(tokenTwo)).toBeFalsy()
    })
    it('should return false if equals with non Token instance', () => {
      const currency = new NativeCurrency(ChainId.GOERLI, 18, 'TEST', 'TEST')
      expect(token.equals(currency)).toBeFalsy()
    })
    it('should return false if equals with non Token instance', () => {
      const currency = new NativeCurrency(ChainId.GOERLI, 18, 'TEST', 'TEST')
      expect(token.equals(currency)).toBeFalsy()
    })
    it('should return true if address are equal', () => {
      expect(token.equals(token)).toBeTruthy()
    })
    it('should return true even if name/symbol/decimals differ', () => {
      const tokenTwo = new Token(ChainId.MAINNET, ERC20_ZERO_ADDRESS, 6, 'TEST2', 'TEST2')
      expect(token.equals(tokenTwo)).toBeTruthy()
    })
  })
  describe('#sortsBefore', () => {
    const token = new Token(ChainId.MAINNET, ERC20_ZERO_ADDRESS, 18, 'TEST', 'TEST')
    it('should fail if tokens are equal', () => {
      expect(() => token.sortsBefore(token)).toThrowError('Tokens are equal. Cannot sort')
    })
    it('should return true if no need to change token direction', () => {
      const tokenTwo = new Token(ChainId.MAINNET, ERC20_ZERO_ADDRESS_TWO, 6, 'TEST2', 'TEST2')
      expect(token.sortsBefore(tokenTwo)).toBeTruthy()
    })
    it('should return true if need to change token direction', () => {
      const tokenTwo = new Token(ChainId.MAINNET, ERC20_ZERO_ADDRESS_TWO, 6, 'TEST2', 'TEST2')
      expect(tokenTwo.sortsBefore(token)).toBeFalsy()
    })
  })
})
