import { ChainId, NativeCurrency, Token } from '../../src'
import { MOCK_ETH_ADDRESS_0, MOCK_ETH_ADDRESS_1, MOCK_ZERO_TRC_ADDRESS, MOCK_ERC20_TOKEN_0, MOCK_ERC20_TOKEN_1 } from '../__mocks__'

describe('Token', () => {
  describe('#constructor', () => {
    it('should create ERC20 instance', () => {
      const token = new Token(ChainId.MAINNET, MOCK_ETH_ADDRESS_0, 6, 'TESTTOKEN', 'TESTTOKEN')
      expect(token).toBeInstanceOf(Token)
    })
    it('should create TRC20 instance', () => {
      const token = new Token(ChainId.MAINNET_TRON_GRID, MOCK_ZERO_TRC_ADDRESS, 6, 'TESTTOKEN', 'TESTTOKEN')
      expect(token).toBeInstanceOf(Token)
    })
    it('should fail to create ERC20 instance with TRC20 address', () => {
      expect(() => new Token(ChainId.MAINNET, MOCK_ZERO_TRC_ADDRESS, 6, 'TESTTOKEN', 'TESTTOKEN')).toThrowError(
        `Address: ${MOCK_ZERO_TRC_ADDRESS} is invalid for chainId: ${ChainId.MAINNET}`
      )
    })
    it('should fail to create TRC20 instance with ERC20 address', () => {
      expect(() => new Token(ChainId.MAINNET_TRON_GRID, MOCK_ETH_ADDRESS_0, 6, 'TESTTOKEN', 'TESTTOKEN')).toThrowError(
        `Address: ${MOCK_ETH_ADDRESS_0} is invalid for chainId: ${ChainId.MAINNET_TRON_GRID}`
      )
    })
  })
  describe('#equals', () => {
    it('should return false if addresses differ', () => {
      expect(MOCK_ERC20_TOKEN_0.equals(MOCK_ERC20_TOKEN_1)).toBeFalsy()
    })

    it('should return false if chain id differs', () => {
      const tokenTwo = new Token(ChainId.GOERLI, MOCK_ETH_ADDRESS_1, 18, 'TEST', 'TEST')
      expect(MOCK_ERC20_TOKEN_0.equals(tokenTwo)).toBeFalsy()
    })
    it('should return false if equals with non Token instance', () => {
      const currency = new NativeCurrency(ChainId.GOERLI, 18, 'TEST', 'TEST')
      expect(MOCK_ERC20_TOKEN_0.equals(currency)).toBeFalsy()
    })
    it('should return true if address are equal', () => {
      expect(MOCK_ERC20_TOKEN_0.equals(MOCK_ERC20_TOKEN_0)).toBeTruthy()
    })
    it('should return true even if name/symbol/decimals differ', () => {
      const tokenTwo = new Token(ChainId.MAINNET, MOCK_ERC20_TOKEN_0.address, 6, 'TEST2', 'TEST2')
      expect(MOCK_ERC20_TOKEN_0.equals(tokenTwo)).toBeTruthy()
    })
  })
  describe('#sortsBefore', () => {
    it('should fail if tokens are equal', () => {
      expect(() => MOCK_ERC20_TOKEN_0.sortsBefore(MOCK_ERC20_TOKEN_0)).toThrowError('Tokens are equal. Cannot sort')
    })
    it('should return true if no need to change token direction', () => {
      expect(MOCK_ERC20_TOKEN_0.sortsBefore(MOCK_ERC20_TOKEN_1)).toBeTruthy()
    })
    it('should return true if need to change token direction', () => {
      expect(MOCK_ERC20_TOKEN_1.sortsBefore(MOCK_ERC20_TOKEN_0)).toBeFalsy()
    })
  })
})
