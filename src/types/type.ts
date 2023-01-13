import { NativeCurrency, Token } from 'entitiesV2'
import JSBI from 'jsbi'

export type BigintIsh = JSBI | bigint | string

export type Currency = NativeCurrency | Token
