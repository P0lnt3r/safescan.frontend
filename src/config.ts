
const LocalHostPort = "192.168.3.92:5000";
const InnetHostPort = "10.0.0.249:5000";

const config = {
    "dev":{
        native_label: "SAFE",
        block_confirmed : 6,
        api_host:`http://${InnetHostPort}`,
        ws_host:`ws://${InnetHostPort}/socket.io`
    },
    "test":{
        native_label: "SAFE",
        block_confirmed : 6,
        api_host:`http://47.107.47.210:5000`,
        ws_host:`ws://47.107.47.210:5000/socket.io`
    }
}


export default config['test'];
