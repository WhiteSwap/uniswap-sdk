import { ChainId, ChainInfo, Network, NetworkType } from '../types'

export const CHAINS: Record<ChainId, ChainInfo> = {
  [ChainId.MAINNET]: {
    networkType: NetworkType.L1,
    network: Network.ETHEREUM
  },
  [ChainId.GOERLI]: {
    networkType: NetworkType.L1,
    network: Network.ETHEREUM
  },
  [ChainId.POLYGON]: {
    networkType: NetworkType.L1,
    network: Network.ETHEREUM
  },
  [ChainId.POLYGON_MUMBAI]: {
    networkType: NetworkType.L1,
    network: Network.ETHEREUM
  },
  [ChainId.MAINNET_TRON_GRID]: {
    networkType: NetworkType.L1,
    network: Network.TRON
  },
  [ChainId.TESTNET_SHASTA]: {
    networkType: NetworkType.L1,
    network: Network.TRON
  }
}
