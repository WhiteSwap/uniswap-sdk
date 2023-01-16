import { isAddress, getAddress } from '@ethersproject/address'
import { Chains } from '../constants/chains'
import invariant from 'tiny-invariant'
import { ChainId, Chain } from '../types'
import tronWeb from 'tronweb'

export function isValidAddress(address: string, chainId: ChainId): boolean {
  if (Chains[chainId] === Chain.ETHEREUM) {
    return isAddress(address)
  }
  if (Chains[chainId] === Chain.TRON) {
    return tronWeb.isAddress(address)
  }
  throw new Error(`Unsupported chainId for validating address. ChainId: ${chainId}, address: ${address}`)
}

// warns if addresses are not checksummed
export function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = getAddress(address)
    return checksummedAddress
  } catch (error) {
    invariant(false, `${address} is not a valid address.`)
  }
}
