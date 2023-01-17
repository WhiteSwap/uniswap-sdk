import { ChainId, Currency } from '../types'
import { Token, NativeCurrency } from '../entities'

type Currencies<T extends Currency> = { [chainId in ChainId]: T }

export const WRAPPED_NATIVE_CURRENCY: Currencies<Token> = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.GOERLI]: new Token(ChainId.GOERLI, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Goerli Ether'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped Polygon Ether'),
  [ChainId.POLYGON_MUMBAI]: new Token(
    ChainId.POLYGON_MUMBAI,
    '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    18,
    'WETH',
    'Wrapped Mumbai Ether'
  ),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'Wrapped Matic'),
  [ChainId.POLYGON_MUMBAI]: new Token(
    ChainId.POLYGON_MUMBAI,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'WMATIC',
    'Wrapped Mumbai Matic'
  ),
  [ChainId.MAINNET_TRON_GRID]: new Token(ChainId.MAINNET_TRON_GRID, 'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR', 6, 'WTRX', 'Wrapped TRX'),
  // FIXME: get real wtrx address in shasta network
  [ChainId.TESTNET_SHASTA]: new Token(ChainId.TESTNET_SHASTA, 'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR', 6, 'WTRX', 'Wrapped TRX')
}

export const NATIVE_CURRENCY: Currencies<NativeCurrency> = {
  [ChainId.MAINNET]: new NativeCurrency(ChainId.MAINNET, 18, 'ETH', 'Ether'),
  [ChainId.GOERLI]: new NativeCurrency(ChainId.GOERLI, 18, 'GöETH', 'Goerli Ether'),
  [ChainId.POLYGON]: new NativeCurrency(ChainId.POLYGON, 18, 'MATIC', 'Polygon Matic'),
  [ChainId.POLYGON_MUMBAI]: new NativeCurrency(ChainId.POLYGON_MUMBAI, 18, 'mMATIC', 'Polygon Mumbai Matic'),
  [ChainId.MAINNET_TRON_GRID]: new NativeCurrency(ChainId.MAINNET_TRON_GRID, 6, 'TRX', 'TRX'),
  [ChainId.TESTNET_SHASTA]: new NativeCurrency(ChainId.TESTNET_SHASTA, 6, 'TRX', 'TRX')
}
