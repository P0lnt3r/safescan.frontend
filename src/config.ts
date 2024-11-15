
const LocalHostPort = "127.0.0.1:5005";
const InnetHostPort = "10.0.0.172:5005";

const config = {
    "dev": {
        native_label: "SAFE",
        block_confirmed: 6,
        api_host: `http://${InnetHostPort}`,
        ws_host: `ws://${InnetHostPort}/socket.io`
    },
    "test": {
        native_label: "SAFE",
        block_confirmed: 6,
        api_host: `https://safe4testnet.anwang.com/5005`,
        ws_host: `wss://safe4testnet.anwang.com/ws/socket.io`
    },
    "prod": {
        native_label: "SAFE",
        block_confirmed: 6,
        api_host: `https://safe4.anwang.com/5005`,
        ws_host: `wss://safe4.anwang.com/ws/socket.io`
    },
}

// export default config['test'];
export default config['test'];
