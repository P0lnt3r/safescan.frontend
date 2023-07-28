import { GET, MasterNodeVO, NodeRegisterActionVO, NodeRewardVO, POST, PageQueryDTO, PageResponseVO, SuperNodeVO, TimestampStatisticVO } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchAll() : Promise<TimestampStatisticVO[]> {
    const serverResponse = await GET( `${API_HOST}/charts/all` );
    return serverResponse;
}