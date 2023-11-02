import { AddressBalanceRankVO, AddressPropVO, AddressVO, POST,GET, PageQueryDTO, PageResponseVO, ERC20AddressBalanceVO, AddressAnaliyic, AddressERC20TokenBalance } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fectAllAddressProp() : Promise< AddressPropVO[] > {
    const serverResponse = await POST( `${API_HOST}/addresses/prop`);
    return serverResponse.data;
}

export async function fetchAddressBalanceRank( params : { token ?: string } | PageQueryDTO ) : Promise< PageResponseVO<AddressBalanceRankVO> >{
    const serverResponse = await POST( `${API_HOST}/addresses/rank` , params );
    return serverResponse.data;
}

export async function fetchAddressERC20Balance( params : { address:string } | PageQueryDTO ) : Promise< PageResponseVO<ERC20AddressBalanceVO> >{
    const serverResponse = await POST( `${API_HOST}/assets/addressERC20` , params );
    return serverResponse.data;
}

export async function fetchAddress( address : string ) : Promise< AddressVO > {
    const serverResponse = await POST( `${API_HOST}/addresses/${address}` );
    return serverResponse.data;
}

export async function fetchAddressAnalytic( address : string ) : Promise< AddressAnaliyic > {
    const serverResponse = await POST( `${API_HOST}/addresses/analytic/${address}` );
    return serverResponse.data;
}

export async function fetchAddressERC20TokenBalance( address : string , token : string ) : Promise< AddressERC20TokenBalance > {
    const serverResponse = await POST( `${API_HOST}/addresses/balance/${address}/${token}` );
    return serverResponse.data;
}