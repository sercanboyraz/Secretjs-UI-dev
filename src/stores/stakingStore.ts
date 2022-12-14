import { action } from 'mobx';
import { ExecuteResult } from 'secretjs';
import StakingService from "../services/staking/stakingService";

class StakingStore {
    @action
    async ReceiptStakeWallet(address: string, customerAmount: string, gas: number): Promise<ExecuteResult> {
        var result = await StakingService.ReceiptStake(address, customerAmount, gas);
        return result;
    }

    @action
    async loads() {
        await StakingService.loads();
    }

    @action
    async queryExchangeRate(address: string) {
        await StakingService.queryExchangeRate(address);
    }

    
}

export default StakingStore;
