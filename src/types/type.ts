import { NativeCurrency, Token } from 'entities'
import JSBI from 'jsbi'

export type BigintIsh = JSBI | number | string | boolean | object

export type Currency = NativeCurrency | Token
