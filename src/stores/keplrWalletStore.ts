import { action, observable } from 'mobx';
import { KeplrResponseDto } from "../services/keplrWallet/dto/keplrResponseDto";
import { withdrawDto } from '../services/keplrWallet/dto/withdrawDto';
import KeplrWalletService from "../services/keplrWallet/keplrWalletService";

class KeplrWalletStore {
    @observable keplr!: KeplrResponseDto | undefined;
    @observable visibility: boolean = true;
    @observable backgroundShow: boolean = false;
    @observable withdraw?: withdrawDto[] = [];

    @action
    async loadKeplrWallet(): Promise<KeplrResponseDto> {

        var result = await KeplrWalletService.load();
        if (this.keplr) {
            this.keplr!.address = result.address;
            this.keplr!.balance = result.balance;
            this.keplr!.balanceString = result.balanceString;
            this.keplr!.exchangeRate = result.exchangeRate;
            this.keplr!.secretInstance = result.secretInstance;
            this.keplr!.address = result.address;
            this.keplr.viewingKey = result.viewingkeyCache;
            // this.keplr!.networkBalance = undefined;
        }
        else
            this.keplr = {
                address: result.address,
                balance: result.balance,
                balanceString: result.balanceString,
                exchangeRate: 1,
                secretInstance: result.secretInstance,
                viewingKey: result.viewingkeyCache
            }

        this.getTransactionFee();

        this.getClaims();

        if (this.keplr.viewingKey) {
            this.getNetworkBalance();
        }

        return result;
    }

    @action
    async clearWallet() {
        this.keplr = undefined;
    }

    @action
    async stakeSCRT(amountScrt: any) {
        console.log("NETWORK_WALLET : " + process.env.REACT_APP_NETWORK_WALLET)
        console.log("BACKEND_WALLET : " + process.env.REACT_APP_NETWORK_BACKEND_WALLET)
        try {
            if (!this.keplr || !process)
                return false;
            var result = await KeplrWalletService.deposit(this.keplr!.secretInstance!, Number(amountScrt) * 1000000, process.env.REACT_APP_NETWORK_WALLET!);
            if (this.keplr!.viewingKey) {
                await this.getNetworkBalance();
            }
            return result;
        } catch (e) {
            console.log(`Failed to deposit: ${e}`);
        }
        return null;
    };

    @action
    async withdrawDSCRT(amountDscrt: any): Promise<boolean> {
        try {
            if (!this.keplr || !process)
                return false;
            var getData = await KeplrWalletService.withdraw(this.keplr!.secretInstance!, Number(amountDscrt) * 1000000, process.env.REACT_APP_NETWORK_BACKEND_WALLET!, process.env.REACT_APP_NETWORK_WALLET!);
            console.log("withdrawDSCRT: " + getData.transactionHash)
            if (this.keplr!.viewingKey) {
                await this.getNetworkBalance();
            }
            await this.getClaims();
            return true;
        } catch (e) {
            console.log(`Failed to withdraw: ${e}`);
            if (e as string && e.message as string) {
                if (e !== undefined && e !== null && e.message !== null && e.message !== undefined && e.message.includes("AES-SIV")) {
                    return true;
                }
            }
            return false;
        }
    };

    // @action
    // async viewingKey() {
    //     try {
    //         var getItem = localStorage.getItem("viewingKey");
    //         if (!getItem) {
    //             var ttt = await KeplrWalletService.viewingkey(this.keplr!.secretInstance!, process.env.REACT_APP_NETWORK_BACKEND_WALLET!);
    //             this.keplr!.viewingKey = ttt;
    //             localStorage.setItem("viewingKey", JSON.stringify(ttt));
    //         }
    //         else {
    //             this.keplr!.viewingKey = JSON.parse(getItem);
    //         }
    //     } catch (e) {
    //         console.log(`Failed to withdraw: ${e}`);
    //     }
    // };

    @action
    async contractTest() {
        var client = this.keplr?.secretInstance!;
        const contractAddress = process.env.REACT_APP_NETWORK_WALLET!;
        const codeId = Number.parseInt(process.env.REACT_APP_NETWORK_CODE_ID!);
        console.log('codeId: ', codeId);

        // contract hash, useful for contract composition
        const contractCodeHash = await client.restClient.getCodeHashByCodeId(codeId);
        console.log(`Contract hash: ${contractCodeHash}`);

        // Create an instance of the Counter contract, providing a starting count
        try {
            const initMsg = { "count": 101 }
            const contract = await client.instantiate(codeId, initMsg, "My Counter" + Math.ceil(Math.random() * 10000));
            console.log('contract: ', contract);
        }
        catch (e) {
            console.log('contract: ', e);
        }

        var response = null;
        // Query the current count
        try {
            console.log('Querying contract for current count');
            response = await client.queryContractSmart(contractAddress, { "get_count": {} });
            console.log(`Count=${response.count}`)
        }
        catch (e) {
            console.log('Querying: ', e);
        }

        // Increment the counter
        try {
            const handleMsg = { increment: {} };
            console.log('Updating count');
            response = await client.execute(contractAddress, handleMsg);
            console.log('response: ', response);
        }
        catch (e) {
            console.log('Updating: ', e);
        }


        // Query again to confirm it worked
        try {
            console.log('Querying contract for updated count');
            response = await client.queryContractSmart(contractAddress, { "get_count": {} })
        }
        catch (e) {
            console.log(' updated count: ', e);
        }


        console.log(`New Count=${response.count}`);
    }

    // async Snip20TokenTest() {

    //     var client = this.keplr?.secretInstance!;
    //     const accAddress = this.keplr?.address!;
    //     const contractAddress = process.env.REACT_APP_NETWORK_WALLET!;

    //     var response = null;
    //     // Entropy: Secure implementation is left to the client, but it is recommended to use base-64 encoded random bytes and not predictable inputs.
    //     const entropy = "Another really random thing";


    //     let handleMsg = { create_viewing_key: { entropy: entropy } };
    //     console.log('Creating viewing key');
    //     response = await client.execute(contractAddress, handleMsg);
    //     console.log('response: ', response);

    //     // Convert the UTF8 bytes to String, before parsing the JSON for the api key.
    //     const apiKey = JSON.parse(fromUtf8(response.data)).create_viewing_key.key;

    //     // Query balance with the api key
    //     const balanceQuery = {
    //         balance: {
    //             key: apiKey,
    //             address: accAddress
    //         }
    //     };
    //     let balance = await client.queryContractSmart(contractAddress, balanceQuery);

    //     console.log('My token balance: ', balance);

    //     // Transfer some tokens
    //     var handleMsg2 = {
    //         stake:
    //         {
    //             owner: accAddress, amount: "1000000", recipient: accAddress
    //         }
    //     };
    //     console.log('Transferring tokens');
    //     response = await client.execute(contractAddress, handleMsg2);
    //     console.log('Transfer response: ', response)

    //     balance = await client.queryContractSmart(contractAddress, balanceQuery);
    //     console.log('New token balance', balance)
    // }

    // async getNetworkBalance() {
    //     var keyViewing = this.keplr?.viewingKey;
    //     // var getviewingKey = localStorage.getItem("viewingKey");
    //     // if (getviewingKey) {
    //     //     keyViewing = getviewingKey;
    //     // }
    //     // if (!process) {
    //     //     return;
    //     // }
    //     var getData = await KeplrWalletService.getBalance(this.keplr!.secretInstance!, this.keplr!.address!, process.env.REACT_APP_NETWORK_BACKEND_WALLET!, keyViewing);
    //     this.keplr!.viewingKey = getData!.viewing_key;
    //     if (getData!.balance && getData!.balance!.balance)
    //         this.keplr!.networkBalance = getData!.balance!.balance!.amount! / 1000000;
    // }

    async getNetworkBalance(): Promise<any> {
        if (!this.keplr || !process)
            return;
        var getData = await KeplrWalletService.getBalance(this.keplr!.secretInstance!, this.keplr!.address!, process.env.REACT_APP_NETWORK_BACKEND_WALLET!, this.keplr?.viewingKey);
        if (getData.error === undefined) {
            this.keplr!.viewingKey = getData!.viewing_key;
            this.keplr!.networkBalance = getData!.balance!.balance !== undefined ? getData!.balance!.balance!.amount! / 1000000 : 0;
        }
        else {
            return getData;
        }
    }

    async getTransactionFee() {
        if (!this.keplr || !process)
            return;
        var getData = await KeplrWalletService.transactionFee(this.keplr!.secretInstance!, process.env.REACT_APP_NETWORK_WALLET!);
        this.keplr!.transactionFee = getData!.dev_fee.fee;
        // this.keplr!.transactionFee = "0";
    }

    async getClaims() {
        if (!this.keplr || !process)
            return;
        var getData = await KeplrWalletService.getClaims(this.keplr!.secretInstance!, this.keplr?.address!, process.env.REACT_APP_NETWORK_WALLET!);
        // this.keplr!.claims = getData!.pending_claims.pending;
        this.withdraw = [];
        getData!.pending_claims.pending.map((x: any) => {
            this.withdraw!.push({ amount: x.withdraw.coins?.amount!, available_time: x.withdraw.available_time });
        })
    }

    async updateClaims() {
        if (!this.keplr || !process)
            return;
        // var getData = await KeplrWalletService.updateClaims(this.keplr!.secretInstance!, process.env.REACT_APP_NETWORK_WALLET!);
        await KeplrWalletService.updateClaims(this.keplr!.secretInstance!, process.env.REACT_APP_NETWORK_WALLET!);
        // this.keplr!.claims = getData!.pending_claims.pending;
        // getData!.pending_claims.pending.map((x: any) => {
        //     this.withdraw!.push({ amount: x.withdraw.coins?.amount!, available_time: x.withdraw.available_time });
        // })
    }

    async setVisibility() {
        if (this.visibility)
            this.visibility = !this.visibility;
    }

    async setVisibilityFalse() {
        this.visibility = false;
    }

    async backgroundVisibilityFalse() {
        this.backgroundShow = false;
    }

    async backgroundVisibilityTrue() {
        this.backgroundShow = true;
    }

    async tokenInfo() {
        if (!this.keplr || !process)
            return;
        var sdsds1 = await this.keplr!.secretInstance!.queryContractSmart(process.env.REACT_APP_NETWORK_WALLET!, { info: {} })
        // var sdsds2 = await this.keplr!.secretInstance!.queryContractSmart(this.keplr!.address!, { info: {} })
        this.keplr!.totalStaked = sdsds1.info.total_staked
        // console.log("sdsds1" + JSON.stringify(sdsds1) );
        // // console.log("sdsds2" + sdsds2);
        // return await KeplrWalletService.tokenInfo(this.keplr!.secretInstance!, process.env.REACT_APP_NETWORK_BACKEND_WALLET!);
    }
}

export default KeplrWalletStore;
