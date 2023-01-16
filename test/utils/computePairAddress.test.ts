import { computePairAddress } from '../../src/utils'
import { ChainId, Token, FACTORY_ADDRESS } from '../../src'

describe('computePairAddress', () => {
  const factoryAddress = FACTORY_ADDRESS[ChainId.MAINNET]

  it('should correctly compute the pool address', () => {
    const tokenA = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
    const tokenB = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
    const result = computePairAddress({
      factoryAddress,
      tokenA,
      tokenB
    })
    expect(result).toEqual('0x47ae2e110AAb81a23ED93842b5A8D96CD93AB93c')
  })
  it('should give same result regardless of token order', () => {
    const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
    const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
    let tokenA = USDC
    let tokenB = DAI
    const resultA = computePairAddress({
      factoryAddress,
      tokenA,
      tokenB
    })

    tokenA = DAI
    tokenB = USDC
    const resultB = computePairAddress({
      factoryAddress,
      tokenA,
      tokenB
    })

    expect(resultA).toEqual(resultB)
  })
})
