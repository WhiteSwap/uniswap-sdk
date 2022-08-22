import { ChainId, Token, Pair, TokenAmount, WETH, Price, WRAPPED_NATIVE_CURRENCY } from '../src'

const WSST1 = new Token(ChainId.MAINNET, '0xce1689b266373D78f9DfbD9e4889baEdD8751EB8', 18, 'WSST1', 'WSST1')

export const USDC = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    6,
    'USDC[ChainId.MAINNET]',
    'USD//C'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
    6,
    'tUSDC[ChainId.RINKEBY]',
    'test USD//C'
  ),
  [ChainId.GOERLI]: new Token(
    ChainId.GOERLI,
    '0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557',
    6,
    'USDC[ChainId.GOERLI]',
    'test USD//C'
  ),
  [ChainId.KOVAN]: new Token(
    ChainId.KOVAN,
    '0xdCFaB8057d08634279f8201b55d311c2a67897D2',
    2,
    'tUSDC[ChainId.KOVAN]',
    'test USD//C'
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0xFE724a829fdF12F7012365dB98730EEe33742ea2',
    2,
    'USDC[ChainId.ROPSTEN]',
    'test USD//C'
  ),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    6,
    'USDC[ChainId.POLYGON]',
    'USD//C'
  ),
  [ChainId.POLYGON_MUMBAI]: new Token(
    ChainId.POLYGON_MUMBAI,
    '0xe11a86849d99f524cac3e7a0ec1241828e332c62',
    6,
    'USDC[ChainId.POLYGON_MUMBAI]',
    'USD//C'
  )
}

export const DAI = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    18,
    'DAI[ChainId.MAINNET]',
    'DAI[ChainId.MAINNET] Stablecoin'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
    18,
    'DAI[ChainId.RINKEBY]',
    'DAI[ChainId.RINKEBY] Stablecoin'
  ),
  [ChainId.GOERLI]: new Token(
    ChainId.GOERLI,
    '0x73967c6a0904aA032C103b4104747E88c566B1A2',
    18,
    'DAI[ChainId.GOERLI]',
    'DAI[ChainId.GOERLI] Stablecoin'
  ),
  [ChainId.KOVAN]: new Token(
    ChainId.KOVAN,
    '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    18,
    'DAI[ChainId.KOVAN]',
    'DAI[ChainId.KOVAN] Stablecoin'
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0xaD6D458402F60fD3Bd25163575031ACDce07538D',
    18,
    'DAI[ChainId.ROPSTEN]',
    'DAI[ChainId.ROPSTEN] Stablecoin'
  ),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    18,
    'DAI[ChainId.POLYGON]',
    'DAI[ChainId.POLYGON] Stablecoin'
  ),
  [ChainId.POLYGON_MUMBAI]: new Token(
    ChainId.POLYGON_MUMBAI,
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    18,
    'DAI[ChainId.POLYGON_MUMBAI]',
    'DAI[ChainId.POLYGON_MUMBAI] Stablecoin'
  )
}

describe('Pair', () => {
  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(
        () => new Pair(new TokenAmount(USDC[ChainId.MAINNET], '100'), new TokenAmount(WETH[ChainId.RINKEBY], '100'))
      ).toThrow('CHAIN_IDS')
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address for MAINNET chain', () => {
      expect(Pair.getAddress(USDC[ChainId.MAINNET], DAI[ChainId.MAINNET])).toEqual(
        '0x47ae2e110AAb81a23ED93842b5A8D96CD93AB93c'
      )
    })
    it('returns the correct address for ROPSTEN chain', () => {
      expect(Pair.getAddress(USDC[ChainId.ROPSTEN], DAI[ChainId.ROPSTEN])).toEqual(
        '0x2EcD774b039Ecf1C66AFd08DB7A6959EEf6bBf7d'
      )
    })
    it('returns the correct address for RINKEBY chain', () => {
      expect(Pair.getAddress(USDC[ChainId.RINKEBY], DAI[ChainId.RINKEBY])).toEqual(
        '0xCFaB9184BbFFF8bBA45F6652c1f68B55Ad147ABF'
      )
    })
    it('returns the correct address for GOERLI chain', () => {
      expect(Pair.getAddress(USDC[ChainId.GOERLI], DAI[ChainId.GOERLI])).toEqual(
        '0xF582f64A0cbd57dEb2426de95bbe240d032D70bD'
      )
    })
    it('returns the correct address for KOVAN chain', () => {
      expect(Pair.getAddress(USDC[ChainId.KOVAN], DAI[ChainId.KOVAN])).toEqual(
        '0x1aB6036Faaa236A34895c480Ca6c1c416aB7E634'
      )
    })
    it('returns the correct address for POLYGON chain', () => {
      expect(Pair.getAddress(USDC[ChainId.POLYGON], DAI[ChainId.POLYGON])).toEqual(
        '0x5F1b14378d615205f691c74C73755723A7C9404F'
      )
    })
    it('returns the correct address for POLYGON_MUMBAI chain', () => {
      expect(Pair.getAddress(WSST1, WRAPPED_NATIVE_CURRENCY[ChainId.POLYGON_MUMBAI])).toEqual(
        '0xC41b6c8635c5bb087AF1E334967D91A2FAbaF751'
      )
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(
        new Pair(new TokenAmount(USDC[ChainId.MAINNET], '100'), new TokenAmount(DAI[ChainId.MAINNET], '100')).token0
      ).toEqual(DAI[ChainId.MAINNET])
      expect(
        new Pair(new TokenAmount(DAI[ChainId.MAINNET], '100'), new TokenAmount(USDC[ChainId.MAINNET], '100')).token0
      ).toEqual(DAI[ChainId.MAINNET])
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(
        new Pair(new TokenAmount(USDC[ChainId.MAINNET], '100'), new TokenAmount(DAI[ChainId.MAINNET], '100')).token1
      ).toEqual(USDC[ChainId.MAINNET])
      expect(
        new Pair(new TokenAmount(DAI[ChainId.MAINNET], '100'), new TokenAmount(USDC[ChainId.MAINNET], '100')).token1
      ).toEqual(USDC[ChainId.MAINNET])
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(
        new Pair(new TokenAmount(USDC[ChainId.MAINNET], '100'), new TokenAmount(DAI[ChainId.MAINNET], '101')).reserve0
      ).toEqual(new TokenAmount(DAI[ChainId.MAINNET], '101'))
      expect(
        new Pair(new TokenAmount(DAI[ChainId.MAINNET], '101'), new TokenAmount(USDC[ChainId.MAINNET], '100')).reserve0
      ).toEqual(new TokenAmount(DAI[ChainId.MAINNET], '101'))
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(
        new Pair(new TokenAmount(USDC[ChainId.MAINNET], '100'), new TokenAmount(DAI[ChainId.MAINNET], '101')).reserve1
      ).toEqual(new TokenAmount(USDC[ChainId.MAINNET], '100'))
      expect(
        new Pair(new TokenAmount(DAI[ChainId.MAINNET], '101'), new TokenAmount(USDC[ChainId.MAINNET], '100')).reserve1
      ).toEqual(new TokenAmount(USDC[ChainId.MAINNET], '100'))
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(
        new Pair(new TokenAmount(USDC[ChainId.MAINNET], '101'), new TokenAmount(DAI[ChainId.MAINNET], '100'))
          .token0Price
      ).toEqual(new Price(DAI[ChainId.MAINNET], USDC[ChainId.MAINNET], '100', '101'))
      expect(
        new Pair(new TokenAmount(DAI[ChainId.MAINNET], '100'), new TokenAmount(USDC[ChainId.MAINNET], '101'))
          .token0Price
      ).toEqual(new Price(DAI[ChainId.MAINNET], USDC[ChainId.MAINNET], '100', '101'))
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(
        new Pair(new TokenAmount(USDC[ChainId.MAINNET], '101'), new TokenAmount(DAI[ChainId.MAINNET], '100'))
          .token1Price
      ).toEqual(new Price(USDC[ChainId.MAINNET], DAI[ChainId.MAINNET], '101', '100'))
      expect(
        new Pair(new TokenAmount(DAI[ChainId.MAINNET], '100'), new TokenAmount(USDC[ChainId.MAINNET], '101'))
          .token1Price
      ).toEqual(new Price(USDC[ChainId.MAINNET], DAI[ChainId.MAINNET], '101', '100'))
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(USDC[ChainId.MAINNET], '101'), new TokenAmount(DAI[ChainId.MAINNET], '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(DAI[ChainId.MAINNET])).toEqual(pair.token0Price)
      expect(pair.priceOf(USDC[ChainId.MAINNET])).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH[ChainId.MAINNET])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(
        new Pair(new TokenAmount(USDC[ChainId.MAINNET], '100'), new TokenAmount(DAI[ChainId.MAINNET], '101')).reserveOf(
          USDC[ChainId.MAINNET]
        )
      ).toEqual(new TokenAmount(USDC[ChainId.MAINNET], '100'))
      expect(
        new Pair(new TokenAmount(DAI[ChainId.MAINNET], '101'), new TokenAmount(USDC[ChainId.MAINNET], '100')).reserveOf(
          USDC[ChainId.MAINNET]
        )
      ).toEqual(new TokenAmount(USDC[ChainId.MAINNET], '100'))
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(DAI[ChainId.MAINNET], '101'), new TokenAmount(USDC[ChainId.MAINNET], '100')).reserveOf(
          WETH[ChainId.MAINNET]
        )
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(
        new Pair(new TokenAmount(USDC[ChainId.MAINNET], '100'), new TokenAmount(DAI[ChainId.MAINNET], '100')).chainId
      ).toEqual(ChainId.MAINNET)
      expect(
        new Pair(new TokenAmount(DAI[ChainId.MAINNET], '100'), new TokenAmount(USDC[ChainId.MAINNET], '100')).chainId
      ).toEqual(ChainId.MAINNET)
    })
  })
  describe('#involvesToken', () => {
    expect(
      new Pair(
        new TokenAmount(USDC[ChainId.MAINNET], '100'),
        new TokenAmount(DAI[ChainId.MAINNET], '100')
      ).involvesToken(USDC[ChainId.MAINNET])
    ).toEqual(true)
    expect(
      new Pair(
        new TokenAmount(USDC[ChainId.MAINNET], '100'),
        new TokenAmount(DAI[ChainId.MAINNET], '100')
      ).involvesToken(DAI[ChainId.MAINNET])
    ).toEqual(true)
    expect(
      new Pair(
        new TokenAmount(USDC[ChainId.MAINNET], '100'),
        new TokenAmount(DAI[ChainId.MAINNET], '100')
      ).involvesToken(WETH[ChainId.MAINNET])
    ).toEqual(false)
  })
})
