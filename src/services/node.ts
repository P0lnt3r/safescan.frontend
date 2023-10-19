import { GET, MasterNodeVO, NodeRegisterActionVO, NodeRewardVO, POST, PageQueryDTO, PageResponseVO, SNVoteActionVO, SuperNodeVO } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchSuperNodes( params : PageQueryDTO ) : Promise<PageResponseVO<SuperNodeVO>> {
    const serverResponse = await POST( `${API_HOST}/nodes/supermasternodes` , { ...params } );
    return serverResponse.data;
}

export async function fetchMasterNodes( params : PageQueryDTO | {address ?: string , ip ?: string , name ?: string} ) : Promise<PageResponseVO<MasterNodeVO>>{
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

export async function fetchTxNodeRegisterActionss( txHash : string ) : Promise<NodeRegisterActionVO[]>{
    const serverResponse = await POST( `${API_HOST}/noderegisters/${txHash}` , {} );
    return serverResponse.data;
}

export async function fetchMasternodeRegisterActions( params : PageQueryDTO ) : Promise<PageResponseVO<NodeRegisterActionVO>>{
    const serverResponse = await POST( `${API_HOST}/noderegisters/masternode` , params );
    return serverResponse.data;
}

export async function fetchSupernodeRegisterActions( params : PageQueryDTO ) : Promise<PageResponseVO<NodeRegisterActionVO>>{
    const serverResponse = await POST( `${API_HOST}/noderegisters/supernode` , params );
    return serverResponse.data;
}

export async function fetchSNVoteActions( params : PageQueryDTO ) : Promise<PageResponseVO<SNVoteActionVO>>{
    const serverResponse = await POST( `${API_HOST}/snvotes` , params );
    return serverResponse.data;
}