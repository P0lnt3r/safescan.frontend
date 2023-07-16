
const LocalHostPort = "127.0.0.1:8080";
const InnetHostPort = "10.0.0.249:8080";

const config = {
    "dev":{
        native_label: "SAFE",
        block_confirmed : 6,
        api_host:`http://${LocalHostPort}`,
        ws_host:`ws://${LocalHostPort}/socket.io`
    }
}

export default config['dev'];
