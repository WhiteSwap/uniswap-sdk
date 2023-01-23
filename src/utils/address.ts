import { isAddress, getAddress, getCreate2Address } from '@ethersproject/address'
import invariant from 'tiny-invariant'
import { ChainId, Network } from '../types'
import { Token } from '../entities'
import tronWeb from 'tronweb'
import { CHAINS, INIT_CODE_HASH, TRON_ADDRESS_PREFIX, TRON_ADDRESS_PREFIX_REGEX } from '../constants'
import { keccak256, pack } from '@ethersproject/solidity'
import { arrayify } from '@ethersproject/bytes'

export function isValidAddress(address: string, chainId: ChainId): boolean {
  if (!CHAINS[chainId]) {
    throw new Error(`Unsupported chainId for validating address. ChainId: ${chainId}, address: ${address}`)
  }
  if (CHAINS[chainId].network === Network.TRON) {
    return tronWeb.isAddress(address)
  }
  return isAddress(address)
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

export function getBase58Create2Address({
  factoryAddress,
  tokenA,
  tokenB
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
}): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  const initCodeHash = INIT_CODE_HASH[token0.chainId]
  const hexFactoryAddress = tronWeb.address.toHex(factoryAddress)
  const hexToken0Address = tronWeb.address.toHex(token0.address).replace(TRON_ADDRESS_PREFIX_REGEX, '')
  const hexToken1Address = tronWeb.address.toHex(token1.address).replace(TRON_ADDRESS_PREFIX_REGEX, '')
  const tokenHash = tronWeb.sha3(arrayify(`${hexToken0Address}${hexToken1Address}`, { allowMissingPrefix: true }), false)
  const hashResult = tronWeb.sha3(arrayify(`${hexFactoryAddress}${tokenHash}${initCodeHash}`, { allowMissingPrefix: true }))
  return tronWeb.address.fromHex(`${TRON_ADDRESS_PREFIX}${hashResult.slice(-40)}`)
}

export function computePairAddress({ factoryAddress, tokenA, tokenB }: { factoryAddress: string; tokenA: Token; tokenB: Token }): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  const salt = keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])])
  return getCreate2Address(factoryAddress, salt, INIT_CODE_HASH[token0.chainId])
}
