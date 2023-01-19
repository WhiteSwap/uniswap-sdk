import { FACTORY_ADDRESS, ZERO, _997, _1000, ONE, MINIMUM_LIQUIDITY, FIVE, Chains, LIQUIDITY_TOKEN } from '../constants/index'
import { InsufficientReservesError, InsufficientInputAmountError } from '../error'
import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { ChainId, BigintIsh, Chain } from '../types'
import { computePairAddress, getBase58Create2Address, sqrt } from '../utils'
import { CurrencyAmount } from './CurrencyAmount'
import { Price } from './Price'
import { Token } from './Token'

export class Pair {
  public readonly address: string
  public readonly liquidityToken: Token
  private readonly tokenAmounts: CurrencyAmount<Token>[]

  public static getAddress(tokenA: Token, tokenB: Token): string {
    if (tokenA.equals(tokenB)) {
      throw new Error('Cannot compute address for identical tokens')
    }

    if (tokenA.chainId !== tokenB.chainId) {
      throw new Error('Tokens should have same chainId')
    }

    const factoryAddress = FACTORY_ADDRESS[tokenA.chainId]
    if (Chains[tokenA.chainId] === Chain.TRON) {
      return getBase58Create2Address({
        factoryAddress,
        tokenA,
        tokenB
      })
    }

    return computePairAddress({
      factoryAddress,
      tokenA,
      tokenB
    })
  }

  public constructor(tokenAmountA: CurrencyAmount<Token>, tokenAmountB: CurrencyAmount<Token>, address?: string) {
    if (tokenAmountA.currency.chainId !== tokenAmountB.currency.chainId) {
      throw new Error('Pair cannot be created with different chainIds')
    }
    const tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    const { name, symbol, decimals } = LIQUIDITY_TOKEN[Chains[tokenAmounts[0].currency.chainId]]
    const computedAddress = address || Pair.getAddress(tokenAmounts[0].currency, tokenAmounts[1].currency)
    this.address = computedAddress
    this.liquidityToken = new Token(tokenAmounts[0].currency.chainId, computedAddress, decimals, name, symbol)
    this.tokenAmounts = tokenAmounts
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  public involvesToken(token: Token): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  public get token0Price(): Price<Token, Token> {
    return new Price(this.token0, this.token1, this.tokenAmounts[0].raw, this.tokenAmounts[1].raw)
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): Price<Token, Token> {
    return new Price(this.token1, this.token0, this.tokenAmounts[1].raw, this.tokenAmounts[0].raw)
  }

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  public priceOf(token: Token): Price<Token, Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): ChainId {
    return this.token0.chainId
  }

  public get token0(): Token {
    return this.tokenAmounts[0].currency
  }

  public get token1(): Token {
    return this.tokenAmounts[1].currency
  }

  public get reserve0(): CurrencyAmount<Token> {
    return this.tokenAmounts[0]
  }

  public get reserve1(): CurrencyAmount<Token> {
    return this.tokenAmounts[1]
  }

  public reserveOf(token: Token): CurrencyAmount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public getOutputAmount(inputAmount: CurrencyAmount<Token>): [CurrencyAmount<Token>, Pair] {
    invariant(this.involvesToken(inputAmount.currency), 'TOKEN')
    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO)) {
      throw new InsufficientReservesError()
    }
    const inputReserve = this.reserveOf(inputAmount.currency)
    const outputReserve = this.reserveOf(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const inputAmountWithFee = JSBI.multiply(inputAmount.raw, _997)
    const numerator = JSBI.multiply(inputAmountWithFee, outputReserve.raw)
    const denominator = JSBI.add(JSBI.multiply(inputReserve.raw, _1000), inputAmountWithFee)
    const outputAmount = new CurrencyAmount(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      JSBI.divide(numerator, denominator)
    )
    if (JSBI.equal(outputAmount.raw, ZERO)) {
      throw new InsufficientInputAmountError()
    }
    return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  public getInputAmount(outputAmount: CurrencyAmount<Token>): [CurrencyAmount<Token>, Pair] {
    invariant(this.involvesToken(outputAmount.currency), 'TOKEN')
    if (
      JSBI.equal(this.reserve0.raw, ZERO) ||
      JSBI.equal(this.reserve1.raw, ZERO) ||
      JSBI.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.currency).raw)
    ) {
      throw new InsufficientReservesError()
    }

    const outputReserve = this.reserveOf(outputAmount.currency)
    const inputReserve = this.reserveOf(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const numerator = JSBI.multiply(JSBI.multiply(inputReserve.raw, outputAmount.raw), _1000)
    const denominator = JSBI.multiply(JSBI.subtract(outputReserve.raw, outputAmount.raw), _997)
    const inputAmount = new CurrencyAmount(
      outputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      JSBI.add(JSBI.divide(numerator, denominator), ONE)
    )
    return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  public getLiquidityMinted(
    totalSupply: CurrencyAmount<Token>,
    tokenAmountA: CurrencyAmount<Token>,
    tokenAmountB: CurrencyAmount<Token>
  ): CurrencyAmount<Token> {
    invariant(totalSupply.currency.equals(this.liquidityToken), 'LIQUIDITY')
    const tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    invariant(tokenAmounts[0].currency.equals(this.token0) && tokenAmounts[1].currency.equals(this.token1), 'TOKEN')

    let liquidity: JSBI
    if (JSBI.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI.subtract(sqrt(JSBI.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), MINIMUM_LIQUIDITY)
    } else {
      const amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw)
      const amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw)
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1
    }
    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError()
    }
    return new CurrencyAmount(this.liquidityToken, liquidity)
  }

  public getLiquidityValue(
    token: Token,
    totalSupply: CurrencyAmount<Token>,
    liquidity: CurrencyAmount<Token>,
    feeOn: boolean = false,
    kLast?: BigintIsh
  ): CurrencyAmount<Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.currency.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.currency.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(JSBI.lessThanOrEqual(liquidity.raw, totalSupply.raw), 'LIQUIDITY')

    let totalSupplyAdjusted: CurrencyAmount<Token>
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    } else {
      invariant(!!kLast, 'K_LAST')
      const kLastParsed = JSBI.BigInt(kLast)
      if (!JSBI.equal(kLastParsed, ZERO)) {
        const rootK = sqrt(JSBI.multiply(this.reserve0.raw, this.reserve1.raw))
        const rootKLast = sqrt(kLastParsed)
        if (JSBI.greaterThan(rootK, rootKLast)) {
          const numerator = JSBI.multiply(totalSupply.raw, JSBI.subtract(rootK, rootKLast))
          const denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast)
          const feeLiquidity = JSBI.divide(numerator, denominator)
          totalSupplyAdjusted = totalSupply.add(new CurrencyAmount(this.liquidityToken, feeLiquidity))
        } else {
          totalSupplyAdjusted = totalSupply
        }
      } else {
        totalSupplyAdjusted = totalSupply
      }
    }

    return new CurrencyAmount(token, JSBI.divide(JSBI.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw))
  }
}
