
const LocalHostPort = "127.0.0.1:5005";
const InnetHostPort = "10.0.0.172:5005";
const DEV = "47.119.151.64:5005";

// Safe4 测试网|主网 网络ID
export enum Safe4NetworkChainId {
    Testnet = 6666666,
    Mainnet = 6666665
}

// Safe4 SAFE 原生币跨链到 BSC 网络资产池地址
export const Application_Crosschain_Pool_BSC: { [chainId in Safe4NetworkChainId]: string } = {
    [Safe4NetworkChainId.Testnet]: "0x7756B490d4Ce394bB6FBA5559C10a8eDc7b102Fc",
    [Safe4NetworkChainId.Mainnet]: "0x7756B490d4Ce394bB6FBA5559C10a8eDc7b102Fc",
};
// Safe4 SAFE 原生币跨链到 ETH 网络资产池地址
export const Application_Crosschain_Pool_ETH: { [chainId in Safe4NetworkChainId]: string } = {
    [Safe4NetworkChainId.Testnet]: "0xaD016d35FE9148F2a8D8A8d37325ada3B7070386",
    [Safe4NetworkChainId.Mainnet]: "0xaD016d35FE9148F2a8D8A8d37325ada3B7070386",
};
// Safe4 SAFE 原生币跨链到 MATIC 网络资产池地址
export const Application_Crosschain_Pool_MATIC: { [chainId in Safe4NetworkChainId]: string } = {
    [Safe4NetworkChainId.Testnet]: "0x8b151740b4a5B2bF7dA631AAD83Be627f97F5790",
    [Safe4NetworkChainId.Mainnet]: "0x8b151740b4a5B2bF7dA631AAD83Be627f97F5790",
};


const config = {
    "dev": {
        native_label: "SAFE",
        block_confirmed: 6,
        api_host: `http://${DEV}`,
        ws_host: `ws://${DEV}/socket.io`
    },
    "test": {
        native_label: "SAFE",
        block_confirmed: 6,
        api_host: `https://safe4testnet.anwang.com/5005`,
        crosschain: `https://safe4testnet.anwang.com/crosschain`,
        ws_host: `wss://safe4testnet.anwang.com/ws/socket.io`
    },
    "prod": {
        native_label: "SAFE",
        block_confirmed: 6,
        api_host: `https://safe4.anwang.com/5005`,
        crosschain: `https://safe4.anwang.com/crosschain`,
        ws_host: `wss://safe4.anwang.com/ws/socket.io`
    },
}

// export default config['test'];
export default config['test'];
