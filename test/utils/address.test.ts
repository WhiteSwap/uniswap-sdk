import { MOCK_DAI_MAINNET, MOCK_USDC_MAINNET } from '../__mocks__'
import { ChainId, Token, FACTORY_ADDRESS, Network } from '../../src'
import { computePairAddress, getBase58Create2Address, getChecksumAddress, isValidAddress } from '../../src/utils'

describe('address', () => {
  describe('#computePairAddress', () => {
    const factoryAddress = FACTORY_ADDRESS[ChainId.MAINNET]

    it('correctly compute the pool address', () => {
      const result = computePairAddress({
        factoryAddress,
        tokenA: MOCK_USDC_MAINNET,
        tokenB: MOCK_DAI_MAINNET
      })
      expect(result).toEqual('0x47ae2e110AAb81a23ED93842b5A8D96CD93AB93c')
    })
    it('give same result regardless of token order', () => {
      const resultA = computePairAddress({
        factoryAddress,
        tokenA: MOCK_USDC_MAINNET,
        tokenB: MOCK_DAI_MAINNET
      })

      const resultB = computePairAddress({
        factoryAddress,
        tokenA: MOCK_DAI_MAINNET,
        tokenB: MOCK_USDC_MAINNET
      })

      expect(resultA).toEqual(resultB)
    })
  })
  describe('#isValidAddress', () => {
    it('return true for valid ethereum address', () => {
      expect(isValidAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', Network.ETHEREUM)).toEqual(true)
    })
    it('return true for valid tron address', () => {
      expect(isValidAddress('TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8', Network.ETHEREUM)).toEqual(false)
    })
    it('return false when pass invalid ethereum address', () => {
      expect(isValidAddress('TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8', Network.ETHEREUM)).toEqual(false)
    })
    it('return false when pass invalid tron address', () => {
      expect(isValidAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', Network.TRON)).toEqual(false)
    })
    it('returns false if not', () => {
      expect(isValidAddress('', Network.ETHEREUM)).toBe(false)
      expect(isValidAddress('0x0000', Network.ETHEREUM)).toBe(false)
      expect(isValidAddress((1 as unknown) as string, Network.ETHEREUM)).toBe(false)
      expect(isValidAddress({} as string, Network.ETHEREUM)).toBe(false)
      expect(isValidAddress((undefined as unknown) as string, Network.ETHEREUM)).toBe(false)
    })
    it('returns the checksummed address', () => {
      expect(getChecksumAddress('0xf164fc0ec4e93095b804a4795bbe1e041497b92a', Network.ETHEREUM)).toBe(
        '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a'
      )
      expect(getChecksumAddress('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a', Network.ETHEREUM)).toBe(
        '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a'
      )
      expect(getChecksumAddress('0xf164fc0ec4e93095b804a4795bbe1e041497b92a', Network.ETHEREUM)).toBe(
        '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a'
      )
      expect(getChecksumAddress('TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR', Network.TRON)).toBe('TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR')
    })

    it('succeeds even without prefix', () => {
      expect(getChecksumAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a', Network.ETHEREUM)).toBe(
        '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a'
      )
    })
    it('fails if too long', () => {
      expect(isValidAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a0', Network.ETHEREUM)).toBe(false)
    })
  })
  describe.skip('#getBase58Create2Address', () => {
    const USDC = new Token(ChainId.MAINNET_TRON_GRID, 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8', 6, 'USDC', 'Tether USD')
    const WSD = new Token(ChainId.MAINNET_TRON_GRID, 'TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S', 18, 'SUN', 'WSD')
    const WTRX = new Token(ChainId.MAINNET_TRON_GRID, 'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR', 6, 'WTRX', 'WTRX')

    it('create correct address for TRON pair', () => {
      expect(
        getBase58Create2Address({
          factoryAddress: FACTORY_ADDRESS[ChainId.MAINNET_TRON_GRID],
          tokenA: USDC,
          tokenB: WSD
        })
      ).toEqual('TF93BSusoPh9fPa6fizSnRFV4zuyVgEwFY')
      expect(
        getBase58Create2Address({
          factoryAddress: FACTORY_ADDRESS[ChainId.MAINNET_TRON_GRID],
          tokenA: WSD,
          tokenB: WTRX
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
