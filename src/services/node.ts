import { GET, MasterNodeVO, NodeRewardVO, POST, PageQueryDTO, PageResponseVO, SuperMasterNodeVO } from "./index.d";
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

export async function fetchAddressNodeRewards( params : { address : string } | PageQueryDTO ) : Promise<PageResponseVO<NodeRewardVO>>{
    const serverResponse = await POST( `${API_HOST}/noderewards` , { ...params } );
    return serverResponse.data;
}

export async function fetchTxNodeRewards( txHash : string ) : Promise<NodeRewardVO[]>{
    const serverResponse = await POST( `${API_HOST}/noderewards/${txHash}` , {} );
    return serverResponse.data;
}