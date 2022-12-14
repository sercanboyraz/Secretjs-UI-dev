import { ExecuteResult, FeeTable, SigningCosmWasmClient } from "secretjs";
// import { StdFee } from "secretjs/types/types";

declare var window: any;

class StakingService {
    public async ReceiptStake(address: string, customerAmount: string, gasParams: number): Promise<ExecuteResult> {
        var handleMsg = { stake: {} };
        var transferAmount = [{ amount: customerAmount, denom: "uscrt" }];
        // var feeData: StdFee = { amount: transferAmount, gas: gasParams.toString() };

        var gasLimits: Partial<FeeTable> = {
            upload: {
                amount: [{ amount: '400000', denom: "uscrt" }],
                gas: '400000'
            },
            init: {
                amount: [{ amount: '200000', denom: 'uscrt' }],
                gas: '200000',
            },
            exec: {
                amount: [{ amount: '100000', denom: 'uscrt' }],
                gas: '100000',
            },
            send: {
                amount: [{ amount: '50000', denom: "uscrt" }],
                gas: '50000'
            },
        };

        const keplrOfflineSigner = window.getOfflineSigner(process.env.REACT_APP_CHAIN_ID);
        var secretUtils = window.getEnigmaUtils(process.env.REACT_APP_CHAIN_ID);
        const client = new SigningCosmWasmClient(
            process.env.REACT_APP_NETWORK!,
            address,
            keplrOfflineSigner,
            secretUtils,
            gasLimits
        );
        console.log('Transferring tokens');
        var response = await client.execute(process.env.REACT_APP_NETWORK_WALLET!, handleMsg, "", transferAmount);
        console.log('Transfer response: ', response)
        return response;
    }

    public async loads() {

        ///Test için eklendi
        // let ws = new WebSocket(process.env.REACT_APP_SECRET_WS_URL!.toString());

        // ws.onopen = function (e) {
        //     console.log("[open] Connection established");

        //     // consume all events for the compute module
        //     let query = `message.module='compute'`

        //     // 1. Listen only for compute events matching code_id
        //     // const CODE_ID = 121;
        //     // query = query + ` AND message.code_id='${CODE_ID}'`;

        //     // 2. Listen for contract instantiations
        //     // query = query + ` AND message.action='instantiate'`;
        //     ws.send(
        //         JSON.stringify({
        //             jsonrpc: "2.0",
        //             method: "subscribe",
        //             params: {
        //                 query,
        //             },
        //             id: "banana", // jsonrpc id
        //         })
        //     );
        // };

        // ws.onmessage = function (event) {
        //     document.getElementById('message')!.textContent = event.data;
        // };

        // ws.onclose = function (event) {
        //     if (event.wasClean) {
        //         alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        //     } else {
        //         // e.g. server process killed or network down
        //         // event.code is usually 1006 in this case
        //         alert('[close] Connection died');
        //     }
        // };

        // ws.onerror = function (error) {
        //     alert(`[error] ${error}`);
        // };

    }


    public async queryExchangeRate(address: string,) {
        var gasLimits: Partial<FeeTable> = {
            upload: {
                amount: [{ amount: '400000', denom: "uscrt" }],
                gas: '400000'
            },
            init: {
                amount: [{ amount: '200000', denom: 'uscrt' }],
                gas: '200000',
            },
            exec: {
                amount: [{ amount: '100000', denom: 'uscrt' }],
                gas: '100000',
            },
            send: {
                amount: [{ amount: '50000', denom: "uscrt" }],
                gas: '50000'
            },
        };

        const keplrOfflineSigner = window.getOfflineSigner(process.env.REACT_APP_CHAIN_ID);
        var secretUtils = window.getEnigmaUtils(process.env.REACT_APP_CHAIN_ID);
        const client = new SigningCosmWasmClient(
            process.env.REACT_APP_NETWORK!,
            address,
            keplrOfflineSigner,
            secretUtils,
            gasLimits
        );

        if (client) {
            let exchange_rate = await client.queryContractSmart("stakingContract", { "exchange_rate": {}});

            console.log(exchange_rate);

            // if (exchange_rate?.exchange_rate?.rate && !isNaN(exchange_rate?.exchange_rate?.rate)) {
            //     setExchangeRate(exchange_rate.exchange_rate.rate);
            //     console.log(`set xrate ${exchange_rate.exchange_rate.rate}`);
            // }
        }
    }
}


export default new StakingService();