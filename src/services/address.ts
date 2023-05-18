import { AddressBalanceRankVO, AddressPropVO, AddressVO, POST,GET, PageQueryDTO, PageResponseVO } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fectAllAddressProp( ) : Promise< AddressPropVO[] > {
    const serverResponse = await POST( `${API_HOST}/addresses/prop`);
    return serverResponse.data;
}

export async function fetchAddressBalanceRank( params : { token ?: string } | PageQueryDTO ) : Promise< PageResponseVO<AddressBalanceRankVO> >{
    const serverResponse = await POST( `${API_HOST}/addresses/rank` , params );
    return serverResponse.data;
}

export async function fetchAddress( address : string ) : Promise< AddressVO > {
    const serverResponse = await POST( `${API_HOST}/addresses/${address}` );
    return serverResponse.data;
}