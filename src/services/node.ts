import { GET, MasterNodeVO, POST, PageQueryDTO, PageResponseVO, SuperMasterNodeVO } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchSuperMasterNodes( params : PageQueryDTO ) : Promise<PageResponseVO<SuperMasterNodeVO>> {
    const serverResponse = await POST( `${API_HOST}/nodes/supermasternodes` , { ...params } );
    return serverResponse.data;
}

export async function fetchMasterNodes( params : PageQueryDTO ) : Promise<PageResponseVO<MasterNodeVO>>{
    const serverResponse = await POST( `${API_HOST}/nodes/masternodes` , { ...params } );
    return serverResponse.data;
}