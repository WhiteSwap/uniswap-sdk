import { Token } from 'entities'

export default interface IToken {
  readonly address: string
  equals: (other: Token) => boolean
}
