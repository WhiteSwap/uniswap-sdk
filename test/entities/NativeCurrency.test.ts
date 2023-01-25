import { ChainId, NativeCurrency, Token } from '../../src'

describe('NativeCurrency', () => {
  describe('#constructor', () => {
    it('create erc20 native currency with valid parameters', () => {
      const nativeCurrency = new NativeCurrency(
        ChainId.MAINNET,
        18,
        'ETH',
        'Ethereum',
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
      )
      expect(nativeCurrency).toBeInstanceOf(NativeCurrency)
      expect(nativeCurrency.chainId).toEqual(ChainId.MAINNET)
      expect(nativeCurrency.decimals).toEqual(18)
      expect(nativeCurrency.symbol).toEqual('ETH')
      expect(nativeCurrency.name).toEqual('Ethereum')
      expect(nativeCurrency.logoURI).toEqual(
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
      )
    })
    it('throw error with unsupported chainId', () => {
      expect(
        () => new NativeCurrency(23, 6, 'TRX', 'TRX', 'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png')
      ).toThrow()
    })
    it('throw error with invalid chainId', () => {
      expect(
        () => new NativeCurrency(23.5, 6, 'TRX', 'TRX', 'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png')
      ).toThrow('Chain id must be a positive integer')
    })
    it('throw error with non-integer decimals', () => {
      expect(
        () =>
          new NativeCurrency(
            ChainId.MAINNET,
            6.5,
            'TRX',
            'TRX',
            'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
          )
      ).toThrow()
    })
    it('throw error with decimals greater than 255', () => {
      expect(
        () =>
          new NativeCurrency(
            ChainId.MAINNET,
            256,
            'TRX',
            'TRX',
            'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
          )
      ).toThrow('Decimals should be greater than 0 and less than 255')
    })
    it('throw error with negative decimals', () => {
      expect(
        () =>
          new NativeCurrency(
            ChainId.MAINNET,
            -1,
            'TRX',
            'TRX',
            'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
          )
      ).toThrow('Decimals should be greater than 0 and less than 255')
    })
    it('throw error with invalid symbol', () => {
      expect(
        () =>
          new NativeCurrency(
            ChainId.MAINNET,
            1,
            (2 as unknown) as string,
            'TRX',
            'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
          )
      ).toThrow('Symbol should be a string')
    })
    it('throw error with symbol length greater than 40', () => {
      expect(
        () =>
          new NativeCurrency(
            ChainId.MAINNET,
            1,
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            'TRX',
            'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
          )
      ).toThrow('Max symbol length is 20')
    })
    it('throw error with symbol length less than 1', () => {
      expect(
        () =>
          new NativeCurrency(
            ChainId.MAINNET,
            1,
            '',
            'TRX',
            'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
          )
      ).toThrow('Min symbol length is 1')
    })
    it('throw error with invalid name', () => {
      expect(
        () =>
          new NativeCurrency(
            ChainId.MAINNET,
            1,
            'TRX',
            (3 as unknown) as string,
            'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
          )
      ).toThrow('Name should be a string')
    })
    it('throw error with name length greater than 40', () => {
      expect(
        () =>
          new NativeCurrency(
            ChainId.MAINNET,
            1,
            'TRX',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec neque nibh. Proin dictum eleifend ipsum, elementum ornare',
            'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
          )
      ).toThrow('Max name length is 40')
    })
    it('throw error with name length less than 1', () => {
      expect(
        () =>
          new NativeCurrency(
            ChainId.MAINNET,
            1,
            'TRX',
            '',
            'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
          )
      ).toThrow('Min name length is 1')
    })
    it('throw error with invalid url', () => {
      expect(() => new NativeCurrency(ChainId.MAINNET, 1, 'TRX', 'TRX', 'invalidUrl')).toThrow('Invalid URL: invalidUrl')
    })
  })
  describe('#equals', () => {
    const mainnetNativeCurrency = new NativeCurrency(
      ChainId.MAINNET,
      18,
      'ETH',
      'Ethereum',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
    )
    it('return false if chain id differs', () => {
      const goerliCurrency = new NativeCurrency(
        ChainId.GOERLI,
        18,
        'ETH',
        'Ethereum',
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
      )
      expect(mainnetNativeCurrency.equals(goerliCurrency)).toBeFalsy()
    })
    it('return true if native currencies are equal', () => {
      expect(mainnetNativeCurrency.equals(mainnetNativeCurrency)).toBeTruthy()
    })
    it('return false if equals with token', () => {
      const token = new Token(
        ChainId.GOERLI,
        '0x0000000000000000000000000000000000000001',
        18,
        'ETH',
        'Ethereum',
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
      )
      expect(mainnetNativeCurrency.equals(token)).toBeFalsy()
    })
  })
})
