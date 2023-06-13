
const LocalHostPort = "127.0.0.1:8080";
const InnetHostPort = "10.0.0.249:8080";

const config = {
    "dev":{
        native_label: "SAFE",
        api_host:`http://${InnetHostPort}`,
        ws_host:`ws://${InnetHostPort}/socket.io`
    }
}

export default config['dev'];
