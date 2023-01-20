export enum ChainId {
  MAINNET = 1,
  GOERLI = 5,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  MAINNET_TRON_GRID = 728126428,
  TESTNET_SHASTA = 2494104990
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

export enum SolidityIntegerType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export enum Network {
  ETHEREUM,
  TRON
}

export enum NetworkType {
  L1,
  L2
}
