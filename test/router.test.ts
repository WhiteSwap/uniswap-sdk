import invariant from 'tiny-invariant'
import {
  ChainId,
  CurrencyAmount,
  Pair,
  Percent,
  Route,
  Router,
  Token,
  Trade,
  NATIVE_CURRENCY,
  WRAPPED_NATIVE_CURRENCY
} from '../src'

import JSBI from 'jsbi'
function checkDeadline(deadline: string[] | string): void {
  expect(typeof deadline).toBe('string')
  invariant(typeof deadline === 'string')
  // less than 5 seconds on the deadline
  expect(new Date().getTime() / 1000 - parseInt(deadline)).toBeLessThanOrEqual(5)
}

describe('Router', () => {
  const WETH = WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET]
  const token0 = new Token(1, '0x0000000000000000000000000000000000000001', 18, 't0', 'test0')
  const token1 = new Token(1, '0x0000000000000000000000000000000000000002', 18, 't1', 'test1')

  const pair_0_1 = new Pair(
    CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(1000)),
    CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(1000))
  )

  const pair_weth_0 = new Pair(CurrencyAmount.fromRawAmount(WETH, '1000'), CurrencyAmount.fromRawAmount(token0, '1000'))

  describe('#swapCallParameters', () => {
    describe('exact in', () => {
      it('ether to token1', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(
            new Route([pair_weth_0, pair_0_1], NATIVE_CURRENCY[pair_weth_0.chainId], token1),
            CurrencyAmount.fromRawAmount(NATIVE_CURRENCY[pair_weth_0.chainId], JSBI.BigInt(100))
          ),
          {
            ttl: 50,
            recipient: '0x0000000000000000000000000000000000000004',
            allowedSlippage: new Percent('1', '100')
          }
        )
        expect(result.methodName).toEqual('swapExactNativeForTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x51',
          [WETH.address, token0.address, token1.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x64')
        checkDeadline(result.args[result.args.length - 1])
      })

      it('deadline specified', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(
            new Route([pair_weth_0, pair_0_1], NATIVE_CURRENCY[pair_weth_0.chainId], token1),
            CurrencyAmount.fromRawAmount(NATIVE_CURRENCY[pair_weth_0.chainId], JSBI.BigInt(100))
          ),
          {
            deadline: 50,
            recipient: '0x0000000000000000000000000000000000000004',
            allowedSlippage: new Percent('1', '100')
          }
        )
        expect(result.methodName).toEqual('swapExactNativeForTokens')
        expect(result.args).toEqual([
          '0x51',
          [WETH.address, token0.address, token1.address],
          '0x0000000000000000000000000000000000000004',
          '0x32'
        ])
        expect(result.value).toEqual('0x64')
      })

      it('token1 to ether', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(
            new Route([pair_0_1, pair_weth_0], token1, NATIVE_CURRENCY[pair_0_1.chainId]),
            CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(100))
          ),
          {
            ttl: 50,
            recipient: '0x0000000000000000000000000000000000000004',
            allowedSlippage: new Percent('1', '100')
          }
        )
        expect(result.methodName).toEqual('swapExactTokensForNative')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x51',
          [token1.address, token0.address, WETH.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('token0 to token1', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(new Route([pair_0_1], token0, token1), CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(100))),
          {
            ttl: 50,
            recipient: '0x0000000000000000000000000000000000000004',
            allowedSlippage: new Percent('1', '100')
          }
        )
        expect(result.methodName).toEqual('swapExactTokensForTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x59',
          [token0.address, token1.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
    })
    describe('exact out', () => {
      it('ether to token1', () => {
        const result = Router.swapCallParameters(
          Trade.exactOut(
            new Route([pair_weth_0, pair_0_1], NATIVE_CURRENCY[pair_weth_0.chainId], token1),
            CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(100))
          ),
          {
            ttl: 50,
            recipient: '0x0000000000000000000000000000000000000004',
            allowedSlippage: new Percent('1', '100')
          }
        )
        expect(result.methodName).toEqual('swapNativeForExactTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          [WETH.address, token0.address, token1.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x80')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('token1 to ether', () => {
        const result = Router.swapCallParameters(
          Trade.exactOut(
            new Route([pair_0_1, pair_weth_0], token1, NATIVE_CURRENCY[pair_0_1.chainId]),
            CurrencyAmount.fromRawAmount(NATIVE_CURRENCY[pair_0_1.chainId], JSBI.BigInt(100))
          ),
          {
            ttl: 50,
            recipient: '0x0000000000000000000000000000000000000004',
            allowedSlippage: new Percent('1', '100')
          }
        )
        expect(result.methodName).toEqual('swapTokensForExactNative')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x80',
          [token1.address, token0.address, WETH.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('token0 to token1', () => {
        const result = Router.swapCallParameters(
          Trade.exactOut(new Route([pair_0_1], token0, token1), CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(100))),
          {
            ttl: 50,
            recipient: '0x0000000000000000000000000000000000000004',
            allowedSlippage: new Percent('1', '100')
          }
        )
        expect(result.methodName).toEqual('swapTokensForExactTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x71',
          [token0.address, token1.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
    })
    describe('supporting fee on transfer', () => {
      describe('exact in', () => {
        it('ether to token1', () => {
          const result = Router.swapCallParameters(
            Trade.exactIn(
              new Route([pair_weth_0, pair_0_1], NATIVE_CURRENCY[pair_0_1.chainId], token1),
              CurrencyAmount.fromRawAmount(NATIVE_CURRENCY[pair_0_1.chainId], JSBI.BigInt(100))
            ),
            {
              ttl: 50,
              recipient: '0x0000000000000000000000000000000000000004',
              allowedSlippage: new Percent('1', '100'),
              feeOnTransfer: true
            }
          )
          expect(result.methodName).toEqual('swapExactNativeForTokensSupportingFeeOnTransferTokens')
          expect(result.args.slice(0, -1)).toEqual([
            '0x51',
            [WETH.address, token0.address, token1.address],
            '0x0000000000000000000000000000000000000004'
          ])
          expect(result.value).toEqual('0x64')
          checkDeadline(result.args[result.args.length - 1])
        })
        it('token1 to ether', () => {
          const result = Router.swapCallParameters(
            Trade.exactIn(
              new Route([pair_0_1, pair_weth_0], token1, NATIVE_CURRENCY[pair_0_1.chainId]),
              CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(100))
            ),
            {
              ttl: 50,
              recipient: '0x0000000000000000000000000000000000000004',
              allowedSlippage: new Percent('1', '100'),
              feeOnTransfer: true
            }
          )
          expect(result.methodName).toEqual('swapExactTokensForNativeSupportingFeeOnTransferTokens')
          expect(result.args.slice(0, -1)).toEqual([
            '0x64',
            '0x51',
            [token1.address, token0.address, WETH.address],
            '0x0000000000000000000000000000000000000004'
          ])
          expect(result.value).toEqual('0x0')
          checkDeadline(result.args[result.args.length - 1])
        })
        it('token0 to token1', () => {
          const result = Router.swapCallParameters(
            Trade.exactIn(
              new Route([pair_0_1], token0, token1),
              CurrencyAmount.fromRawAmount(token0, JSBI.BigInt(100))
            ),
            {
              ttl: 50,
              recipient: '0x0000000000000000000000000000000000000004',
              allowedSlippage: new Percent('1', '100'),
              feeOnTransfer: true
            }
          )
          expect(result.methodName).toEqual('swapExactTokensForTokensSupportingFeeOnTransferTokens')
          expect(result.args.slice(0, -1)).toEqual([
            '0x64',
            '0x59',
            [token0.address, token1.address],
            '0x0000000000000000000000000000000000000004'
          ])
          expect(result.value).toEqual('0x0')
          checkDeadline(result.args[result.args.length - 1])
        })
      })
      describe('exact out', () => {
        it('ether to token1', () => {
          expect(() =>
            Router.swapCallParameters(
              Trade.exactOut(
                new Route([pair_weth_0, pair_0_1], NATIVE_CURRENCY[pair_weth_0.chainId], token1),
                CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(100))
              ),
              {
                ttl: 50,
                recipient: '0x0000000000000000000000000000000000000004',
                allowedSlippage: new Percent('1', '100'),
                feeOnTransfer: true
              }
            )
          ).toThrow('EXACT_OUT_FOT')
        })
        it('token1 to ether', () => {
          expect(() =>
            Router.swapCallParameters(
              Trade.exactOut(
                new Route([pair_0_1, pair_weth_0], token1, NATIVE_CURRENCY[pair_0_1.chainId]),
                CurrencyAmount.fromRawAmount(NATIVE_CURRENCY[pair_0_1.chainId], JSBI.BigInt(100))
              ),
              {
                ttl: 50,
                recipient: '0x0000000000000000000000000000000000000004',
                allowedSlippage: new Percent('1', '100'),
                feeOnTransfer: true
              }
            )
          ).toThrow('EXACT_OUT_FOT')
        })
        it('token0 to token1', () => {
          expect(() =>
            Router.swapCallParameters(
              Trade.exactOut(
                new Route([pair_0_1], token0, token1),
                CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(100))
              ),
              {
                ttl: 50,
                recipient: '0x0000000000000000000000000000000000000004',
                allowedSlippage: new Percent('1', '100'),
                feeOnTransfer: true
              }
            )
          ).toThrow('EXACT_OUT_FOT')
        })
      })
    })
  })
})
