/**
 * See all ids below
 * https://ethereum.stackexchange.com/questions/17051/how-to-select-a-network-id-or-is-there-a-list-of-network-ids
 */
export const GOERLI_ID = 5;
export const KOVAN_ID = 42;
export const MAINNET_ID = 1;
export const RINKEBY_ID = 4;
export const ROPSTEN_ID = 3;

const testnetAddresses = {};

export default {
  [GOERLI_ID]: testnetAddresses,
  [KOVAN_ID]: testnetAddresses,
  [MAINNET_ID]: {},
  [RINKEBY_ID]: testnetAddresses,
  [ROPSTEN_ID]: testnetAddresses,
};
