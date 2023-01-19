import { isAddress, getAddress, getCreate2Address } from '@ethersproject/address'
import { Chains } from '../constants/chains'
import invariant from 'tiny-invariant'
import { ChainId, Chain } from '../types'
import { Token } from '../entities'
import tronWeb from 'tronweb'
import { INIT_CODE_HASH, TRON_ADDRESS_PREFIX, TRON_ADDRESS_PREFIX_REGEX } from '../constants'
import { keccak256, pack } from '@ethersproject/solidity'
import { hexToString } from './bytes'

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
  const hexFactoryAddress = tronWeb.address.toHex(factoryAddress).replace(TRON_ADDRESS_PREFIX_REGEX, '')
  const hexToken0Address = tronWeb.address.toHex(token0.address).replace(TRON_ADDRESS_PREFIX_REGEX, '')
  const hexToken1Address = tronWeb.address.toHex(token1.address).replace(TRON_ADDRESS_PREFIX_REGEX, '')
  const tokenStr = hexToken0Address + hexToken1Address
  const initCodeHash = INIT_CODE_HASH[tokenA.chainId]
  const tokenHash = tronWeb.sha3(hexToString(tokenStr)).replace(/0x/, '')
  const hashResult = tronWeb.sha3(hexToString(`${TRON_ADDRESS_PREFIX}${hexFactoryAddress}${tokenHash}${initCodeHash}`))
  return tronWeb.address.fromHex(`${TRON_ADDRESS_PREFIX}${hashResult.substr(-40)}`)
}

export function computePairAddress({ factoryAddress, tokenA, tokenB }: { factoryAddress: string; tokenA: Token; tokenB: Token }): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  const salt = keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])])
  return getCreate2Address(factoryAddress, salt, INIT_CODE_HASH[token0.chainId])
}
