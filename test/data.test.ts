import { ChainId, Token, Fetcher } from '../src'

// TODO: replace the provider in these tests
describe('data', () => {
  it('Token', async () => {
    const token = await Fetcher.fetchTokenData(
      ChainId.MAINNET,
      '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      undefined,
      'DAI',
      'DAI Stable Coin'
    ) // DAI
    expect(token.decimals).toEqual(18)
  })

  it('Token:CACHE', async () => {
    const token = await Fetcher.fetchTokenData(
      ChainId.MAINNET,
      '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A',
      undefined,
      'DGD',
      'DGD Stable Coin'
    ) // DGD
    expect(token.decimals).toEqual(9)
  })

  it('Pair', async () => {
    const TWSD = new Token(ChainId.GOERLI, '0xce1689b266373D78f9DfbD9e4889baEdD8751EB8', 18, 'TWSD', 'TWSD') // DAI
    const TUSDT = new Token(ChainId.GOERLI, '0x0239523c6ed5614fbd16020423097d6073a06c85', 6, 'TUSDT', 'TUSDT') // DAI
    const pair = await Fetcher.fetchPairData(TWSD, TUSDT)
    expect(pair.liquidityToken.address).toEqual('0xeAcE72edf6B9f5d872A8c40A8e8997aB13C9bb66')
  })
})
