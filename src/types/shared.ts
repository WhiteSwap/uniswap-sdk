import JSBI from 'jsbi'

export type BigintIsh = JSBI | bigint | string

export enum ChainId {
  MAINNET = 1,
  GOERLI = 5,
  SEPOLIA = 11155111,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  POLYGON_ZKEVM = 1101,
  POLYGON_ZKEVM_TESTNET = 1442,
  WHITECHAIN = 1875,
  WHITECHAIN_TESTNET = 2625
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

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}
