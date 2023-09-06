
const LocalHostPort = "127.0.0.1:5005";
const InnetHostPort = "10.0.0.172:5005";

const config = {
    "dev":{
        native_label: "SAFE",
        block_confirmed : 6,
        api_host:`http://${LocalHostPort}`,
        ws_host:`ws://${LocalHostPort}/socket.io`
    },
    "test":{
        native_label: "SAFE",
        block_confirmed : 6,
        api_host:`http://47.107.47.210:5005`,
        ws_host:`ws://47.107.47.210:5005/socket.io`
    }
}

export default config['test'];
