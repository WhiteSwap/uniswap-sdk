import { Currency } from '../types'
import { NativeCurrency, Token } from '../entities'

export function wrapCurrency(currency?: Currency): Token | undefined {
  if (currency) {
    if (!(currency instanceof Token) && !(currency instanceof NativeCurrency)) {
      throw new Error('Cannot cast to Token instance. Param must instance of NativeCurrency or Token')
    }
    return currency instanceof Token ? currency : currency.wrappedToken
  }
  return undefined
}
