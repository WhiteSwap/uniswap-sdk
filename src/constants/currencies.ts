import { ChainId } from '../types'
import { NativeCurrency, Token, Currency } from '../entities'

type Currencies<T extends Currency> = { [chainId in ChainId]: T }

export const WETH: Currencies<Token> = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.GOERLI]: new Token(
    ChainId.GOERLI,
    '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    18,
    'WETH',
    'Wrapped Goerli Ether'
  ),
  [ChainId.SEPOLIA]: new Token(
    ChainId.SEPOLIA,
    '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
    18,
    'WETH',
    'Wrapped Sepolia Ether'
  ),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    18,
    'WETH',
    'Wrapped Polygon Ether'
  ),
  [ChainId.POLYGON_MUMBAI]: new Token(
    ChainId.POLYGON_MUMBAI,
    '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    18,
    'WETH',
    'Wrapped Mumbai Ether'
  ),
  [ChainId.POLYGON_ZKEVM]: new Token(
    ChainId.POLYGON_ZKEVM,
    '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.POLYGON_ZKEVM_TESTNET]: new Token(
    ChainId.POLYGON_ZKEVM_TESTNET,
    '0x2ad78787CCaf7FA8FAe8953FD78ab9163f81DcC8',
    18,
    'WETH',
    'Wrapped Ether'
  )
}

export const NATIVE_CURRENCY: Currencies<NativeCurrency> = {
  [ChainId.MAINNET]: new NativeCurrency(ChainId.MAINNET, 18, 'ETH', 'Ether'),
  [ChainId.GOERLI]: new NativeCurrency(ChainId.GOERLI, 18, 'GöETH', 'Goerli Ether'),
  [ChainId.SEPOLIA]: new NativeCurrency(ChainId.SEPOLIA, 18, 'SepoliaETH', 'Sepolia Ether'),
  [ChainId.POLYGON]: new NativeCurrency(ChainId.POLYGON, 18, 'MATIC', 'Polygon Matic'),
  [ChainId.POLYGON_MUMBAI]: new NativeCurrency(ChainId.POLYGON_MUMBAI, 18, 'mMATIC', 'Polygon Mumbai Matic'),
  [ChainId.POLYGON_ZKEVM]: new NativeCurrency(ChainId.POLYGON_ZKEVM, 18, 'ETH', 'Ether'),
  [ChainId.POLYGON_ZKEVM_TESTNET]: new NativeCurrency(ChainId.POLYGON_ZKEVM_TESTNET, 18, 'ETH', 'Ether'),
  [ChainId.WHITECHAIN_TESTNET]: new NativeCurrency(ChainId.WHITECHAIN_TESTNET, 18, 'WBT', 'WhiteBit Token')
}

export const WRAPPED_NATIVE_CURRENCY: Currencies<Token> = {
  ...WETH,
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    18,
    'WMATIC',
    'Wrapped Matic'
  ),
  [ChainId.POLYGON_MUMBAI]: new Token(
    ChainId.POLYGON_MUMBAI,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'WMATIC',
    'Wrapped Mumbai Matic'
  ),
  [ChainId.WHITECHAIN_TESTNET]: new Token(
    ChainId.WHITECHAIN_TESTNET,
    '0x75BaE36f5102C3330B1Eac366630D02d3A8796b3',
    18,
    'WWBT',
    'Wrapped WBT'
  )
}
