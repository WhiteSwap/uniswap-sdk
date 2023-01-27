import { ChainId, Currency, NATIVE_CURRENCY, wrapCurrency, WRAPPED_NATIVE_CURRENCY } from '../../src'
import { MOCK_ERC20_TOKEN_0 } from '../__mocks__'

describe('#wrapCurrency', () => {
  it('wrap native currency to wrapped token', () => {
    const nativeCurrency = NATIVE_CURRENCY[ChainId.MAINNET]
    expect(wrapCurrency(nativeCurrency)).toEqual(WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET])
  })
  it('should not wrap token', () => {
    expect(wrapCurrency(MOCK_ERC20_TOKEN_0)).toEqual(MOCK_ERC20_TOKEN_0)
  })
  it('throw error when pass invalid currency', () => {
    expect(() => wrapCurrency(({} as unknown) as Currency)).toThrow()
  })
  it('return nothing when passed currency is empty', () => {
    expect(wrapCurrency(undefined)).toEqual(undefined)
  })
})
