import { NativeCurrency, Token } from 'entitiesV2'
import JSBI from 'jsbi'

export type BigintIsh = JSBI | number | string | boolean | object

export type Currency = NativeCurrency | Token
