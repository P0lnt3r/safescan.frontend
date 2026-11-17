// Safe4 测试网|主网 网络ID
export enum Safe4NetworkChainId {
    Testnet = 6666666,
    Mainnet = 6666665
}

// Safe4 SAFE 原生币跨链到 BSC 网络资产池地址
export const Application_Crosschain_Pool_BSC: { [chainId in Safe4NetworkChainId]: string } = {
    [Safe4NetworkChainId.Testnet]: "0x7756B490d4Ce394bB6FBA5559C10a8eDc7b102Fc",
    [Safe4NetworkChainId.Mainnet]: "0x471B9eB32a6750b0356E0C80294Ee035C4bdF60B",
};
// Safe4 SAFE 原生币跨链到 ETH 网络资产池地址
export const Application_Crosschain_Pool_ETH: { [chainId in Safe4NetworkChainId]: string } = {
    [Safe4NetworkChainId.Testnet]: "0xaD016d35FE9148F2a8D8A8d37325ada3B7070386",
    [Safe4NetworkChainId.Mainnet]: "0x30728eBa408684D167CF59828261Db8A2A59E8C7",
};
// Safe4 SAFE 原生币跨链到 MATIC 网络资产池地址
export const Application_Crosschain_Pool_MATIC: { [chainId in Safe4NetworkChainId]: string } = {
    [Safe4NetworkChainId.Testnet]: "0x8b151740b4a5B2bF7dA631AAD83Be627f97F5790",
    [Safe4NetworkChainId.Mainnet]: "0x960Bb626aba915c242301EC47948Ba475CDeC090",
};

const config = {
    "dev": {
        native_label: "SAFE",
        block_confirmed: 6,
        crosschain: `https://safe4.anwang.com/crosschain`,

        // Localhost
        // api_host: `http://${LocalHostPort}`,
        // ws_host: `ws://${LocalHostPort}/socket.io`,

        // Local_Testnet
        // api_host: "http://10.0.0.178:9003",
        // ws_host: "ws://10.0.0.178:9003/socket.io",

        // Local_Mainnet
        api_host: "http://10.0.0.197/9003",
        ws_host: "ws://10.0.0.197/ws/socket.io",
    },
    "testnet": {
        native_label: "SAFE",
        block_confirmed: 6,
        api_host: `https://safe4testnet.anwang.com/9003`,
        ws_host: `wss://safe4testnet.anwang.com/ws/socket.io`,
        crosschain: `https://safe4.anwang.com/crosschain`
    },
    "mainnet": {
        native_label: "SAFE",
        block_confirmed: 6,
        api_host: `https://safe4.anwang.com/9003`,
        crosschain: `https://safe4.anwang.com/crosschain`,
        ws_host: `wss://safe4.anwang.com/ws/socket.io`
    },
}

export default config['mainnet'];
