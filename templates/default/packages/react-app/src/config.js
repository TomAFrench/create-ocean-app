export const ipfsGatewayUri =
  process.env.REACT_APP_IPFS_GATEWAY_URI || 'https://gateway.ipfs.io'
export const ipfsNodeUri =
  process.env.REACT_APP_IPFS_NODE_URI || 'https://ipfs.infura.io:5001'

function getOceanSetupOptions(network) {
  switch (network){
    case "pacific":
      return {
        nodeUri: 'https://pacific.oceanprotocol.com',
        aquariusUri: 'https://aquarius.test.oceanprotocol.com',
        brizoUri: 'https://brizo.test.oceanprotocol.com',
        brizoAddress: '0x0474ed05ba757dde575dfaaaa267d9e7f3643abc',
        secretStoreUri: 'https://secret-store.oceanprotocol.com'
      }
    case "nile":
      return {
        nodeUri: 'https://nile.dev-ocean.com',
        aquariusUri: 'https://aquarius.marketplace.dev-ocean.com',
        brizoUri: 'https://brizo.marketplace.dev-ocean.com',
        brizoAddress: '0x4aaab179035dc57b35e2ce066919048686f82972',
        secretStoreUri: 'https://secret-store.nile.dev-ocean.com'
      }
    case "spree":
      return {
        nodeUri: 'http://localhost:8545',
        aquariusUri: 'http://aquarius:5000',
        brizoUri: 'http://localhost:8030',
        brizoAddress: '0x00bd138abd70e2f00903268f3db08f2d25677c9e',
        secretStoreUri: 'http://localhost:12001',
      }
    default: 
        throw new Error(`Network "${network} not recognised"`)
  }
}

export const OCEAN_SETUP_OPTIONS = getOceanSetupOptions(process.env.REACT_APP_OCEAN_NETWORK)