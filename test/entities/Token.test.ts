import { ChainId, NativeCurrency, Token } from '../../src'
import { MOCK_ETH_ADDRESS_0, MOCK_ETH_ADDRESS_1, MOCK_ZERO_TRC_ADDRESS, MOCK_ERC20_TOKEN_0, MOCK_ERC20_TOKEN_1 } from '../__mocks__'

describe('Token', () => {
  describe('#constructor', () => {
    it('create correct ERC20 instance', () => {
      const token = new Token(ChainId.MAINNET, MOCK_ETH_ADDRESS_0, 6, 'TESTTOKEN', 'TESTTOKEN')
      expect(token).toBeInstanceOf(Token)
      expect(token.address).toEqual(MOCK_ETH_ADDRESS_0)
      expect(token.chainId).toEqual(ChainId.MAINNET)
      expect(token.decimals).toEqual(6)
      expect(token.isNative).toEqual(false)
      expect(token.logoURI).toEqual(undefined)
      expect(token.name).toEqual('TESTTOKEN')
      expect(token.symbol).toEqual('TESTTOKEN')
    })
    it('create correct TRC20 instance', () => {
      const token = new Token(ChainId.MAINNET_TRON_GRID, MOCK_ZERO_TRC_ADDRESS, 6, 'TESTTOKEN', 'TESTTOKEN')
      expect(token).toBeInstanceOf(Token)
      expect(token.address).toEqual(MOCK_ZERO_TRC_ADDRESS)
      expect(token.chainId).toEqual(ChainId.MAINNET_TRON_GRID)
      expect(token.decimals).toEqual(6)
      expect(token.isNative).toEqual(false)
      expect(token.logoURI).toEqual(undefined)
      expect(token.name).toEqual('TESTTOKEN')
      expect(token.symbol).toEqual('TESTTOKEN')
    })
    it('throw error with invalid address for ERC20 token', () => {
      expect(() => new Token(ChainId.MAINNET, MOCK_ZERO_TRC_ADDRESS, 6, 'TESTTOKEN', 'TESTTOKEN')).toThrow()
      expect(() => new Token(ChainId.MAINNET, 'invalidAddress', 6, 'TESTTOKEN', 'TESTTOKEN')).toThrow()
    })
    it('throw error with invalid address for TRC20 token', () => {
      expect(() => new Token(ChainId.MAINNET_TRON_GRID, MOCK_ETH_ADDRESS_0, 6, 'TESTTOKEN', 'TESTTOKEN')).toThrow()
      expect(() => new Token(ChainId.MAINNET_TRON_GRID, 'invalidAddress', 6, 'TESTTOKEN', 'TESTTOKEN')).toThrow()
    })
  })
  describe('#equals', () => {
    it('return false if addresses differ', () => {
      expect(MOCK_ERC20_TOKEN_0.equals(MOCK_ERC20_TOKEN_1)).toBeFalsy()
    })
    it('return false if chain id differs', () => {
      const tokenTwo = new Token(ChainId.GOERLI, MOCK_ETH_ADDRESS_1, 18, 'TEST', 'TEST')
      expect(MOCK_ERC20_TOKEN_0.equals(tokenTwo)).toBeFalsy()
    })
    it('return false if equals with non Token instance', () => {
      const currency = new NativeCurrency(ChainId.GOERLI, 18, 'TEST', 'TEST')
      expect(MOCK_ERC20_TOKEN_0.equals(currency)).toBeFalsy()
    })
    it('return true if address are equal', () => {
      expect(MOCK_ERC20_TOKEN_0.equals(MOCK_ERC20_TOKEN_0)).toBeTruthy()
    })
    it('return true even if name/symbol/decimals differ', () => {
      const tokenTwo = new Token(ChainId.MAINNET, MOCK_ERC20_TOKEN_0.address, 6, 'TEST2', 'TEST2')
      expect(MOCK_ERC20_TOKEN_0.equals(tokenTwo)).toBeTruthy()
    })
  })
  describe('#sortsBefore', () => {
    it('throw error if tokens are equal', () => {
      expect(() => MOCK_ERC20_TOKEN_0.sortsBefore(MOCK_ERC20_TOKEN_0)).toThrow()
    })
    it('return true if no need to change token direction', () => {
      expect(MOCK_ERC20_TOKEN_0.sortsBefore(MOCK_ERC20_TOKEN_1)).toBeTruthy()
    })
    it('return false if need to change token direction', () => {
      expect(MOCK_ERC20_TOKEN_1.sortsBefore(MOCK_ERC20_TOKEN_0)).toBeFalsy()
    })
  })
})
