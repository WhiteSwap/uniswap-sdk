import { MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, MOCK_ERC20_TOKEN_0, MOCK_ERC20_TOKEN_1 } from '../__mocks__'
import {
  CurrencyAmount,
  Pair,
  Price,
  Token,
  InsufficientInputAmountError,
  WRAPPED_NATIVE_CURRENCY,
  ChainId,
  LIQUIDITY_TOKEN,
  Network
} from '../../src'

const pairUsdcDai = new Pair(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100'), CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '100'))
const pairDaiUsdc = new Pair(CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '100'), CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100'))

describe('Pair', () => {
  describe('#constructor', () => {
    it('should create ethereum Pair instance with valid params', () => {
      const pair = new Pair(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, 10), CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, 2))
      expect(pair).toBeInstanceOf(Pair)
      expect(pair.chainId).toEqual(ChainId.MAINNET)
      expect(pair.liquidityToken).toEqual(
        new Token(
          ChainId.MAINNET,
          Pair.getAddress(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET),
          18,
          LIQUIDITY_TOKEN[Network.ETHEREUM].name,
          LIQUIDITY_TOKEN[Network.ETHEREUM].symbol
        )
      )
    })
    // TODO: create unit test for creating tron pair
    it('should fail to create pair for tokens on different chains', () => {
      expect(
        () =>
          new Pair(
            CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100'),
            CurrencyAmount.fromRawAmount(WRAPPED_NATIVE_CURRENCY[ChainId.GOERLI], '100')
          )
      ).toThrowError('Pair cannot be created with different chainIds')
    })
  })

  describe('#getAddress', () => {
    it('should returns the correct address', () => {
      expect(Pair.getAddress(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET)).toEqual('0x47ae2e110AAb81a23ED93842b5A8D96CD93AB93c')
    })
  })

  describe('#token0', () => {
    it('should save same order of tokens if token0 < token1', () => {
      expect(pairDaiUsdc.token0).toEqual(MOCK_DAI_MAINNET)
    })
    it('should swap token0 & token1 if token0 > token1', () => {
      expect(pairUsdcDai.token0).toEqual(MOCK_DAI_MAINNET)
    })
  })
  describe('#token1', () => {
    it('should save same order of tokens if token0 < token1', () => {
      expect(pairDaiUsdc.token1).toEqual(MOCK_USDC_MAINNET)
    })
    it('should swap token0 & token1 if token0 > token1', () => {
      expect(pairUsdcDai.token1).toEqual(MOCK_USDC_MAINNET)
    })
  })
  describe('#reserve0', () => {
    it('should return correct reserve for sorted tokens', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100'), CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '101')).reserve0
      ).toEqual(CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '101'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '101'), CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100')).reserve0
      ).toEqual(CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '101'))
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100'), CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '101')).reserve1
      ).toEqual(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '101'), CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100')).reserve1
      ).toEqual(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100'))
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '101'), CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '100')).token0Price
      ).toEqual(new Price(MOCK_DAI_MAINNET, MOCK_USDC_MAINNET, '100', '101'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '100'), CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '101')).token0Price
      ).toEqual(new Price(MOCK_DAI_MAINNET, MOCK_USDC_MAINNET, '100', '101'))
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '101'), CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '100')).token1Price
      ).toEqual(new Price(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, '101', '100'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '100'), CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '101')).token1Price
      ).toEqual(new Price(MOCK_USDC_MAINNET, MOCK_DAI_MAINNET, '101', '100'))
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '101'), CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(MOCK_DAI_MAINNET)).toEqual(pair.token0Price)
      expect(pair.priceOf(MOCK_USDC_MAINNET)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(
        new Pair(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100'), CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '101')).reserveOf(
          MOCK_USDC_MAINNET
        )
      ).toEqual(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100'))
      expect(
        new Pair(CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '101'), CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100')).reserveOf(
          MOCK_USDC_MAINNET
        )
      ).toEqual(CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100'))
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(CurrencyAmount.fromRawAmount(MOCK_DAI_MAINNET, '101'), CurrencyAmount.fromRawAmount(MOCK_USDC_MAINNET, '100')).reserveOf(
          WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET]
        )
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(pairUsdcDai.chainId).toEqual(1)
      expect(pairDaiUsdc.chainId).toEqual(1)
    })
  })
  describe('#involvesToken', () => {
    expect(pairUsdcDai.involvesToken(MOCK_USDC_MAINNET)).toEqual(true)
    expect(pairUsdcDai.involvesToken(MOCK_DAI_MAINNET)).toEqual(true)
    expect(pairUsdcDai.involvesToken(WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET])).toEqual(false)
  })
  describe('miscellaneous', () => {
    const tokenA = MOCK_ERC20_TOKEN_0
    const tokenB = MOCK_ERC20_TOKEN_1

    it('getLiquidityMinted:0', async () => {
      const pair = new Pair(CurrencyAmount.fromRawAmount(tokenA, '0'), CurrencyAmount.fromRawAmount(tokenB, '0'))

      expect(() => {
        pair.getLiquidityMinted(
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '0'),
          CurrencyAmount.fromRawAmount(tokenA, '1000'),
          CurrencyAmount.fromRawAmount(tokenB, '1000')
        )
      }).toThrow(InsufficientInputAmountError)

      expect(() => {
        pair.getLiquidityMinted(
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '0'),
          CurrencyAmount.fromRawAmount(tokenA, '1000000'),
          CurrencyAmount.fromRawAmount(tokenB, '1')
        )
      }).toThrow(InsufficientInputAmountError)

      const liquidity = pair.getLiquidityMinted(
        CurrencyAmount.fromRawAmount(pair.liquidityToken, '0'),
        CurrencyAmount.fromRawAmount(tokenA, '1001'),
        CurrencyAmount.fromRawAmount(tokenB, '1001')
      )

      expect(liquidity.quotient.toString()).toEqual('1')
    })

    it('getLiquidityMinted:!0', async () => {
      const pair = new Pair(CurrencyAmount.fromRawAmount(tokenA, '10000'), CurrencyAmount.fromRawAmount(tokenB, '10000'))

      expect(
        pair
          .getLiquidityMinted(
            CurrencyAmount.fromRawAmount(pair.liquidityToken, '10000'),
            CurrencyAmount.fromRawAmount(tokenA, '2000'),
            CurrencyAmount.fromRawAmount(tokenB, '2000')
          )
          .quotient.toString()
      ).toEqual('2000')
    })

    it('getLiquidityValue:!feeOn', async () => {
      const pair = new Pair(CurrencyAmount.fromRawAmount(tokenA, '1000'), CurrencyAmount.fromRawAmount(tokenB, '1000'))

      {
        const liquidityValue = pair.getLiquidityValue(
          tokenA,
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '1000'),
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '1000'),
          false
        )
        expect(liquidityValue.currency.equals(tokenA)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('1000')
      }

      // 500
      {
        const liquidityValue = pair.getLiquidityValue(
          tokenA,
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '1000'),
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '500'),
          false
        )
        expect(liquidityValue.currency.equals(tokenA)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('500')
      }

      // tokenB
      {
        const liquidityValue = pair.getLiquidityValue(
          tokenB,
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '1000'),
          CurrencyAmount.fromRawAmount(pair.liquidityToken, '1000'),
          false
        )
        expect(liquidityValue.currency.equals(tokenB)).toBe(true)
        expect(liquidityValue.quotient.toString()).toBe('1000')
      }
    })

    it('getLiquidityValue:feeOn', async () => {
      const pair = new Pair(CurrencyAmount.fromRawAmount(tokenA, '1000'), CurrencyAmount.fromRawAmount(tokenB, '1000'))

      const liquidityValue = pair.getLiquidityValue(
        tokenA,
        CurrencyAmount.fromRawAmount(pair.liquidityToken, '500'),
        CurrencyAmount.fromRawAmount(pair.liquidityToken, '500'),
        true,
        '250000' // 500 ** 2
      )
      expect(liquidityValue.currency.equals(tokenA)).toBe(true)
      expect(liquidityValue.quotient.toString()).toBe('917') // ceiling(1000 - (500 * (1 / 6)))
    })
  })
})
