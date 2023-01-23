import { isHexString } from '@ethersproject/bytes'
import tronWeb from 'tronweb'

export function hexlifyAddress(address: string): string {
  return isHexString(address) ? address : tronWeb.address.toHex(address)
}
