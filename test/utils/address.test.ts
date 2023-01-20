import { ChainId, Token, FACTORY_ADDRESS } from '../../src'
import { computePairAddress, getBase58Create2Address, isValidAddress } from '../../src/utils'

describe('address', () => {
  describe('#computePairAddress', () => {
    const factoryAddress = FACTORY_ADDRESS[ChainId.MAINNET]
    const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
    const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')

    it('correctly compute the pool address', () => {
      const result = computePairAddress({
        factoryAddress,
        tokenA: USDC,
        tokenB: DAI
      })
      expect(result).toEqual('0x47ae2e110AAb81a23ED93842b5A8D96CD93AB93c')
    })
    it('give same result regardless of token order', () => {
      const resultA = computePairAddress({
        factoryAddress,
        tokenA: USDC,
        tokenB: DAI
      })

      const resultB = computePairAddress({
        factoryAddress,
        tokenA: DAI,
        tokenB: USDC
      })

      expect(resultA).toEqual(resultB)
    })
  })
  describe('#isValidAddress', () => {
    it('return true for valid ethereum address', () => {
      expect(isValidAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', ChainId.MAINNET)).toEqual(true)
    })
    it('return true for valid tron address', () => {
      expect(isValidAddress('TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8', ChainId.MAINNET)).toEqual(false)
    })
    it('return false when pass invalid ethereum address', () => {
      expect(isValidAddress('TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8', ChainId.MAINNET)).toEqual(false)
    })
    it('return false when pass invalid tron address', () => {
      expect(isValidAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', ChainId.MAINNET_TRON_GRID)).toEqual(false)
    })
    it('throw error when pass invalid chainId', () => {
      expect(() => isValidAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 23)).toThrow()
    })
  })
  describe.skip('#getBase58Create2Address', () => {
    const USDC = new Token(ChainId.MAINNET_TRON_GRID, 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8', 6, 'USDC', 'Tether USD')
    const WSD = new Token(ChainId.MAINNET_TRON_GRID, 'TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S', 18, 'SUN', 'WSD')

    it('create correct address for TRON pair', () => {
      expect(
        getBase58Create2Address({
          factoryAddress: FACTORY_ADDRESS[ChainId.MAINNET_TRON_GRID],
          tokenA: USDC,
          tokenB: WSD
        })
      ).toEqual('TF93BSusoPh9fPa6fizSnRFV4zuyVgEwFY')
    })
    it('return same result regardless of token order', () => {
      const resultA = getBase58Create2Address({
        factoryAddress: FACTORY_ADDRESS[ChainId.MAINNET_TRON_GRID],
        tokenA: USDC,
        tokenB: WSD
      })
      const resultB = getBase58Create2Address({
        factoryAddress: FACTORY_ADDRESS[ChainId.MAINNET_TRON_GRID],
        tokenA: WSD,
        tokenB: USDC
      })
      expect(resultA).toEqual(resultB)
    })
  })
})
