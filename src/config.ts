
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
        api_host: `http://47.107.47.210:5005`,
        ws_host: `ws://47.107.47.210:5005/socket.io`
    },
    "prod": {
        native_label: "SAFE",
        block_confirmed: 6,
        api_host: `http://safe4.anwang.com:5005`,
        ws_host: `ws://safe4.anwang.com:5005/socket.io`
    },

    "prodssl": {
        native_label: "SAFE",
        block_confirmed: 6,
        api_host: `https://safe4.anwang.com/5005`,
        ws_host: `wss://safe4.anwang.com/ws/socket.io`
    },
}

// export default config['test'];
export default config['dev'];
