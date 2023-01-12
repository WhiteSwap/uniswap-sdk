import { NativeCurrency } from '../entitiesV2/NativeCurrency'

export default interface INativeCurrency {
  equals: (other: NativeCurrency) => boolean
}
