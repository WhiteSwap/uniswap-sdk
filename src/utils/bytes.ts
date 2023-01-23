import tronWeb from 'tronweb'

export function isHex(value: string) {
  return typeof value === 'string' && !isNaN(parseInt(value, 16)) && /^(0x|)[a-fA-F0-9]+$/.test(value)
}

// FIXME: remove var, fix reassign params
export function hexToString(hex: string) {
  if (!isHex(hex)) {
    throw new Error('is not a hex string.')
  }
  if (hex.length % 2 !== 0) {
    hex = '0' + hex
  }
  var bytes = []
  for (var n = 0; n < hex.length; n += 2) {
    var code = parseInt(hex.substr(n, 2), 16)
    bytes.push(code)
  }
  return bytes
}

export function hexlifyAddress(address: string): string {
  return isHex(address) ? address : tronWeb.address.toHex(address)
}
