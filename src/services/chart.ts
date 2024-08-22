import { GET, MasterNodeVO, NodeRegisterActionVO, NodeRewardVO, POST, PageQueryDTO, PageResponseVO, StateVO, SuperNodeVO, TimestampStatisticVO } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchAll() : Promise<TimestampStatisticVO[]> {
    const serverResponse = await GET( `${API_HOST}/charts/all` );
    return serverResponse;
}

export async function fetchMasternodesState() : Promise<StateVO> {
    const serverResponse = await GET( `${API_HOST}/charts/masterNodes/state` );
    return serverResponse;
}

export async function fetchSupernodesState() : Promise<StateVO> {
    const serverResponse = await GET( `${API_HOST}/charts/supernodes/state` );
    return serverResponse;
}
