import { ChainId, NativeCurrency, Token } from '../../src'

describe('NativeCurrency', () => {
  describe('#constructor', () => {
    it('should create erc20 native currency with valid parameters', () => {
      expect(
        new NativeCurrency(
          ChainId.MAINNET,
          18,
          'ETH',
          'Ethereum',
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
        )
      ).toBeInstanceOf(NativeCurrency)
    })
    it('should create trc20 native currency with valid parameters', () => {
      expect(
        new NativeCurrency(
          ChainId.MAINNET_TRON_GRID,
          6,
          'TRX',
          'TRX',
          'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
        )
      ).toBeInstanceOf(NativeCurrency)
    })
    it('should fail with unsupported chainId', () => {
      expect(
        () =>
          new NativeCurrency(
            23,
            6,
            'TRX',
            'TRX',
            'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
          )
      ).toThrow(`Wrapped currency doesn't exist for TRX and 23`)
    })
    it('should fail with invalid chainId', () => {
      expect(
        () =>
          new NativeCurrency(
            23.5,
            6,
            'TRX',
            'TRX',
            'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
          )
      ).toThrow('Chain id must be a positive integer')
    })
    it('should fail with non-integer decimals', () => {
      expect(
        () =>
          new NativeCurrency(
            ChainId.MAINNET,
            6.5,
            'TRX',
            'TRX',
            'https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png'
          )
      ).toThrow('Decimals value is invalid. Decimals should be a integer number')
    })
    it('should fail with decimals greater than max', () => {
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
    it('should fail with decimals less than min', () => {
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
    it('should fail with invalid symbol', () => {
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
    it('should fail with symbol length greater than max', () => {
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
    it('should fail with symbol length less than min', () => {
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
    it('should fail with invalid name', () => {
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
    it('should fail with name length greater than max', () => {
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
    it('should fail with name length less than min', () => {
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
    it('should fail with invalid url', () => {
      expect(() => new NativeCurrency(ChainId.MAINNET, 1, 'TRX', 'TRX', 'invalidUrl')).toThrow(
        'Invalid URL: invalidUrl'
      )
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
    it('should return false if chain id differs', () => {
      const goerliCurrency = new NativeCurrency(
        ChainId.GOERLI,
        18,
        'ETH',
        'Ethereum',
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
      )
      expect(mainnetNativeCurrency.equals(goerliCurrency)).toBeFalsy()
    })
    it('should return true if native currencies are equal', () => {
      expect(mainnetNativeCurrency.equals(mainnetNativeCurrency)).toBeTruthy()
    })
    it('should return false if equals with token', () => {
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
