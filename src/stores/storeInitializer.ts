import CosmwasmStore from "./cosmwasmStore";
import KeplrWalletStore from "./keplrWalletStore";
import StakingStore from "./stakingStore";


export default function initializeStores() {
  return {
    keplrWalletStore: new KeplrWalletStore(),
    cosmwasmStore: new CosmwasmStore(),
    stakingStore: new StakingStore()
  };
}
