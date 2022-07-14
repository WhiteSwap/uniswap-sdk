import { ChainId } from 'types'
import { NativeCurrency, Token, Currency } from 'entities'

type Currencies<T extends Currency> = { [chainId in ChainId]: T }

export const WETH: Currencies<Token> = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped Ropsten Ether'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped Rinkeby Ether'
  ),
  [ChainId.GOERLI]: new Token(
    ChainId.GOERLI,
    '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    18,
    'WETH',
    'Wrapped Goerli Ether'
  ),
  [ChainId.KOVAN]: new Token(
    ChainId.KOVAN,
    '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
    18,
    'WETH',
    'Wrapped Kovan Ether'
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
}

export const NATIVE_CURRENCY: Currencies<NativeCurrency> = {
  [ChainId.MAINNET]: new NativeCurrency(ChainId.MAINNET, 18, 'ETH', 'Ether'),
  [ChainId.ROPSTEN]: new NativeCurrency(ChainId.ROPSTEN, 18, 'RopETH', 'Ropsten Ether'),
  [ChainId.RINKEBY]: new NativeCurrency(ChainId.RINKEBY, 18, 'RinETH', 'Rinkeby Ether'),
  [ChainId.GOERLI]: new NativeCurrency(ChainId.GOERLI, 18, 'GoeETH', 'Goerli Ether'),
  [ChainId.KOVAN]: new NativeCurrency(ChainId.KOVAN, 18, 'KovETH', 'Kovan Ether'),
  [ChainId.POLYGON]: new NativeCurrency(ChainId.POLYGON, 18, 'MATIC', 'Polygon Matic'),
  [ChainId.POLYGON_MUMBAI]: new NativeCurrency(ChainId.POLYGON_MUMBAI, 18, 'mMATIC', 'Polygon Mumbai Matic'),
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
}
