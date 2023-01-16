import { Chain, ChainId } from '../types'

export const Chains: Record<ChainId, Chain> = {
  [ChainId.MAINNET]: Chain.ETHEREUM,
  [ChainId.GOERLI]: Chain.ETHEREUM,
  [ChainId.POLYGON]: Chain.ETHEREUM,
  [ChainId.POLYGON_MUMBAI]: Chain.ETHEREUM,
  [ChainId.MAINNET_TRON_GRID]: Chain.TRON,
  [ChainId.TESTNET_SHASTA]: Chain.TRON
}
