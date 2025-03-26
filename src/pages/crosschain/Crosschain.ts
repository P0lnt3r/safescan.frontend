import { NetworkCoinType, NetworkTxIdPrefix } from "../../images/networks_logos/NetworkLogo";


export const enum CrosschainDirectoinType {
    SEND = 1,
    RECEIVE = 2
}

export const enum CrosschainDirection {
    SAFE4_NETWORKS = "safe4_networks",
    NETWORKS_SAFE4 = "networks_safe4"
}

export function getCrosschainDirection(prefix: string) {
    if (Object.values(NetworkCoinType).includes(prefix as NetworkCoinType)) {
        return CrosschainDirection.SAFE4_NETWORKS;
    };
    if (Object.values(NetworkTxIdPrefix).includes(prefix as NetworkTxIdPrefix)) {
        return CrosschainDirection.NETWORKS_SAFE4;
    }
    return undefined;
}