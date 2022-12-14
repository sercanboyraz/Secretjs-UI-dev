import { ExecuteResult, FeeTable, SigningCosmWasmClient } from "secretjs";
import { StdFee } from "secretjs/types/types";
import { KeplrWalletInterface } from "./keplrWalletInterface";
// import { decode as base64_decode, encode as base64_encode } from "base-64";

// const tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");

declare let window: any;
declare let document: any;

class KeplrWalletService implements KeplrWalletInterface {

  public async load(): Promise<any> {
    const chainId = process.env.REACT_APP_CHAIN_ID;
    const chainName = process.env.REACT_APP_CHAIN_NAME;
    let address = "";

    if (!window.getOfflineSigner || !window.keplr) {
      alert("Please install keplr extension");
    }
    else if (window.keplr.experimentalSuggestChain) {
      try {

        const configExtensionKepler: any = {
          chainId: chainId!,
          chainName: chainName!,
          addressPrefix: "secret",// "wasm"
          rpcUrl: process.env.REACT_APP_NETWORK_RPC!,
          httpUrl: process.env.REACT_APP_NETWORK!,
          faucetUrl: process.env.REACT_APP_NETWORK_FAUCETURL!,
          feeToken: "uscrt",
          stakingToken: "scrt",
          coinMap: {
            scrt: { denom: "SCRT", fractionalDigits: 6 },
            uscrt: { denom: "uSCRT", fractionalDigits: 6 },
          },
          gasPrice: 1,
          codeId: Number.parseInt(process.env.REACT_APP_NETWORK_CODE_ID!)
        }

        await window.keplr.experimentalSuggestChain(this.configKeplr(configExtensionKepler));
        // This method will ask the user whether or not to allow access if they haven't visited this website.
        // Also, it will request user to unlock the wallet if the wallet is locked.
        // If you don't request enabling before usage, there is no guarantee that other methods will work.
        await window.keplr.enable(chainId);

        // @ts-ignore
        const keplrOfflineSigner = window.getOfflineSigner(chainId);
        const accounts = await keplrOfflineSigner.getAccounts();

        address = accounts[0].address;

        window.keplr.defaultOptions = {
          sign: {
            preferNoSetFee: true,
            preferNoSetMemo: true,
          }
        }

        window.addEventListener("keplr_keystorechange", (e: any) => {
          console.log("Key store in Keplr is changed. You may need to refetch the account info.")
          console.log(`abowww:${e}`)
        })

        const gasLimits: Partial<FeeTable> = {
          upload: {
            amount: [{ amount: '200000', denom: "uscrt" }],
            gas: '400000'
          },
          init: {
            amount: [{ amount: '200000', denom: 'uscrt' }],
            gas: '400000',
          },
          exec: {
            amount: [{ amount: '100000', denom: 'uscrt' }],
            gas: '200000',
          },
          send: {
            amount: [{ amount: '20000', denom: "uscrt" }],
            gas: '40000'
          },
        };

        const secretJS = new SigningCosmWasmClient(
          process.env.REACT_APP_NETWORK!,
          address,
          keplrOfflineSigner,
          window.getEnigmaUtils(chainId),
          gasLimits
        );

        const account = await secretJS.getAccount(address);
        const getNonce = await secretJS.getNonce(address);

        console.log(`account:${JSON.stringify(account)}`);
        console.log(`nonce:${JSON.stringify(getNonce)}`);
        let exchangeRate = 1;

        if (secretJS) {
          const addres = process.env.REACT_APP_NETWORK_WALLET!;
          const exchange_rate = await secretJS.queryContractSmart(addres, { "exchange_rate": {} });
          // console.log(exchange_rate);
          if (exchange_rate?.exchange_rate?.rate && !isNaN(exchange_rate?.exchange_rate?.rate)) {
            exchangeRate = exchange_rate.exchange_rate.rate;
          }
        }
        // burası add token keplr 
        let viewing_key_keplr = "";
        await window.keplr.suggestToken(chainId, process.env.REACT_APP_NETWORK_BACKEND_WALLET).then(async (x: any) => {
          await window.keplr.getSecret20ViewingKey(chainId, process.env.REACT_APP_NETWORK_BACKEND_WALLET).then((x: any) => {
            viewing_key_keplr = x;
            localStorage.setItem("viewingKey", x);
          });
        });

        if (!localStorage.getItem("viewingKey")) {
          await window.keplr.getSecret20ViewingKey(chainId, process.env.REACT_APP_NETWORK_BACKEND_WALLET).then((x: any) => {
            viewing_key_keplr = x;
            localStorage.setItem("viewingKey", x);
          });
        }
        /// ////////////////

        // var viewingkeyDat = window.keplr.getSecret20ViewingKey("pulsar-2", "secret1q9zrcalvkfcfhx05rld79l6s8kxmg5p0ewvfqv");
        // console.log("viewingkeyDat1" + JSON.stringify(viewingkeyDat));

        // var viewingkeyDat = window.keplr.getSecret20ViewingKey(chainId, process.env.REACT_APP_NETWORK_BACKEND_WALLET);
        // console.log("viewingkeyDat2" + JSON.stringify(viewingkeyDat));

        // var viewingkeyDat = window.keplr.getSecret20ViewingKey(chainId, address);
        // console.log("viewingkeyDat3" + JSON.stringify(viewingkeyDat));
        let strBal = "0 USCRT";
        let bal = 0;

        if (account) {
          // For testing this assumes a new account with only uscrt in the list of balances
          const getScrt = this.getScrt(account);
          strBal = getScrt.strBalance;
          bal = getScrt.balance;
        }
        // var sdse = await secretJS.queryContractSmart(process.env.REACT_APP_NETWORK_WALLET!, {
        //   "window": {},
        // });
        // console.log("windowwindowwindow:" + JSON.stringify(sdse) )
        // let balance = await this.Snip20GetBalance(
        //   secretJS,
        //   process.env.REACT_APP_NETWORK_WALLET,
        //   address,
        //   "yo"
        // );

        // console.log("dffdfddfdffddffdfddf:" + balance)

        return { address, balance: bal, balanceString: strBal, exchangeRate, secretInstance: secretJS, viewingkeyCache: viewing_key_keplr };
      }
      catch (error) {
        alert(error);
        throw error;
      }
    } else {
      alert("Please use the recent version of keplr extension");
    }
  }



  configKeplr(config: any): any {
    console.log(config);
    return {
      chainId: config.chainId,
      chainName: config.chainName,
      rpc: config.rpcUrl,
      rest: config.httpUrl,
      bech32Config: {
        bech32PrefixAccAddr: `${config.addressPrefix}`,
        bech32PrefixAccPub: `${config.addressPrefix}pub`,
        bech32PrefixValAddr: `${config.addressPrefix}valoper`,
        bech32PrefixValPub: `${config.addressPrefix}valoperpub`,
        bech32PrefixConsAddr: `${config.addressPrefix}valcons`,
        bech32PrefixConsPub: `${config.addressPrefix}valconspub`,
      },
      currencies: [
        {
          coinDenom: config.coinMap[config.feeToken].denom,
          coinMinimalDenom: config.feeToken,
          coinDecimals: config.coinMap[config.feeToken].fractionalDigits,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: config.coinMap[config.stakingToken].denom,
          coinMinimalDenom: config.feeToken,
          coinDecimals: config.coinMap[config.stakingToken].fractionalDigits,
        },
      ],
      stakeCurrency: {
        coinDenom: config.coinMap[config.stakingToken].denom,
        coinMinimalDenom: config.feeToken,
        coinDecimals: config.coinMap[config.stakingToken].fractionalDigits,
      },
      gasPriceStep: {
        low: config.gasPrice / 4,
        average: config.gasPrice / 2,
        high: config.gasPrice / 1,
      },
      // gasPriceStep: {
      //   low: 0.01,
      //   average: 0.05,
      //   high: 0.1,
      // },
      bip44: { coinType: 529 },
      coinType: 529,
      features: ["secretwasm"]
    };
  }

  isDenomScrt(balance: any) {
    return balance.denom === 'uscrt';
  }

  getScrt(account: any) {
    if (account === undefined) {
      return { strBalance: '0 SCRT', balance: 0 }
    }
    const balance = account.balance.find(this.isDenomScrt);
    let amount = 0;
    if (balance) {
      amount = balance.amount > 0 ? balance.amount / 10 ** 6 : 0;
    }
    return { strBalance: `${amount} SCRT`, balance: amount };

  }


  // async Snip20GetBalance(secretjs: any, token: any, address: any, key: any) {

  //   let balanceResponse;
  //   try {
  //     balanceResponse = await secretjs.queryContractSmart(token, {
  //       "balance": {
  //         address: address,
  //         key,
  //       },
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     return 'Unlock';
  //   }

  //   if (balanceResponse.viewing_key_error) {
  //     return 'Fix Unlock';
  //   }

  //   if (Number(balanceResponse.balance.amount) === 0) {
  //     return '0';
  //   }
  //   return balanceResponse.balance.amount;
  // };

  async deposit(secretNetwork: SigningCosmWasmClient, uscrtAmount: number, stakingContractAddress: string): Promise<ExecuteResult> {
    // var gasLimits: StdFee = {
    //   gas: (uscrtAmount * 0.01).toString(),//"600000",
    //   amount: [
    //     {
    //       amount: (uscrtAmount).toString(), denom: "uscrt"
    //     }
    //   ],
    // };
    // console.log("asdasd" + gasLimits);
    const result = secretNetwork.execute(
      stakingContractAddress,
      { stake: {}, },
      '',
      [{ amount: String(uscrtAmount), denom: 'uscrt' }],
      // gasLimits
    );
    return result;
  };

  async withdraw(secretNetwork: SigningCosmWasmClient, amount: number, userWalletAddress: string, stakingContractAddress: string): Promise<ExecuteResult> {
    const gasLimits: StdFee = {
      gas: "1000000",// "600000",
      amount: [
        {
          amount: (amount).toString(), denom: "uscrt"
        }
      ],
    };
    const result = secretNetwork.execute(userWalletAddress,
      {
        "send": { "recipient": stakingContractAddress, "amount": amount.toString(), "msg": "eyJ3aXRoZHJhdyI6IHt9fQ" }
      }, undefined, undefined, gasLimits
    );
    return result;
  };

  async sendCoin(secretNetwork: SigningCosmWasmClient, amount: number, userWalletAddress: string) {
    try {
      const gasLimits: StdFee = {
        gas: (amount * 0.01).toString(),// "600000",
        amount: [
          {
            amount: (amount * 0.01).toString(), denom: "uscrt"
          }
        ],
      };
      const transferAmount = [{ amount: amount.toString(), denom: "uscrt" }];

      return secretNetwork.sendTokens(userWalletAddress, transferAmount, '', gasLimits);
    } catch (e) {
      console.log(`Failed to sendCoin ${e}`);
    }
    return null;
  };

  // async viewingkey(secretNetwork: SigningCosmWasmClient, stakingContractAddress: string) {
  //   const entropy = "yo";
  //   let handleMsg = { create_viewing_key: { entropy: entropy } };
  //   console.log('Creating viewing key');
  //   return await secretNetwork.execute(stakingContractAddress, handleMsg);
  // }

  async getBalance(secretNetwork: SigningCosmWasmClient, userWalletAddress: string, stakingContractAddress: string, apiKeyParams: any) {
    try {
      var balance = undefined;
      let apiKey = "";
      if (localStorage.getItem("viewingKey")) {
        apiKey = localStorage.getItem("viewingKey")!;
      }
      else {
        // if (!apiKeyParams) {
        //   const entropy = "yo";
        //   let handleMsg = { create_viewing_key: { entropy: entropy } };
        //   console.log('Creating viewing key');

        //   var gasLimits: StdFee = {
        //     gas: "50000",
        //     amount: [
        //       {
        //         amount: "50000", denom: "uscrt"
        //       }
        //     ],
        //   };

        //   apiKeyParams = await secretNetwork.execute(stakingContractAddress, handleMsg, undefined, undefined, gasLimits);
        //   // let encoded = base64_encode(JSON.stringify(apiKeyParams));
        //   // localStorage.setItem("viewingKey", encoded);
        // }
        // apiKey = JSON.parse(fromUtf8(apiKeyParams.data)).create_viewing_key.key;
        // localStorage.setItem("viewingKey", apiKey);
      }
      balance = await secretNetwork.queryContractSmart(stakingContractAddress, {
        balance: {
          address: userWalletAddress,
          key: apiKey,
        },
      });
      console.log(`getBalance : ${JSON.stringify(balance)}`);
      if (balance.viewing_key_error) {
        setTimeout(async () => {
          apiKey = localStorage.getItem("viewingKey")!;
          balance = await secretNetwork.queryContractSmart(stakingContractAddress, {
            balance: {
              address: userWalletAddress,
              key: apiKey,
            },
          });
          console.log(`getBalance : ${JSON.stringify(balance)}`);
        }, 3000);
      }
    } catch (error) {
      return { error };
    }

    return { balance, viewing_key: apiKeyParams };
  }

  async transactionFee(secretNetwork: SigningCosmWasmClient, stakingContractAddress: string): Promise<any> {
    const transactionFeeRequest = await secretNetwork.queryContractSmart(stakingContractAddress, {
      query_dev_fee: {},
    });

    console.log(`activation_fee Unix data : ${Date.now()}`)
    const activationfeeRequest = await secretNetwork.queryContractSmart(stakingContractAddress, {
      "activation_fee": { "current_time": Date.now() }
    });

    console.log(`activation_fee:${JSON.stringify(activationfeeRequest)}`)
    console.log(`transactionFee:${JSON.stringify(transactionFeeRequest)}`)
    return transactionFeeRequest;
  };

  async getClaims(secretNetwork: SigningCosmWasmClient, userWalletAddress: string, stakingContractAddress: string) {
    const claimsRequest = await secretNetwork.queryContractSmart(stakingContractAddress, {
      "claims": { "address": userWalletAddress, "current_time": Date.now() }
    });
    console.log(`getClaims:${JSON.stringify(claimsRequest)}`)
    return claimsRequest;
  }

  async updateClaims(secretNetwork: SigningCosmWasmClient, stakingContractAddress: string) {
    const claimsRequest = await secretNetwork.queryContractSmart(stakingContractAddress, {
      "claims": {}
    });
    console.log(`updateClaim:${JSON.stringify(claimsRequest)}`)
    return claimsRequest;
  }

  async tokenInfo(secretNetwork: SigningCosmWasmClient, stakingContractAddress: string) {
    const handleMsg = { "info": {} };
    return await secretNetwork.queryContractSmart(stakingContractAddress, handleMsg);
  }

}

export default new KeplrWalletService();