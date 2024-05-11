import { AddressBalanceRankVO, AddressPropVO, AddressVO, POST,GET, PageQueryDTO, PageResponseVO, ERC20AddressBalanceVO, AddressAnaliyic, AddressERC20TokenBalance, Safe3RedeemVO, Safe3AddressRedeemVO } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;


export async function fetchAddressSafe3Redeems( params : { address:string } | PageQueryDTO ) : Promise< PageResponseVO<Safe3RedeemVO> >{
    const serverResponse = await POST( `${API_HOST}/safe3/redeems` , params );
    return serverResponse.data;
}

export async function fetchAddressSafe3Redeem( address : string ) :Promise<Safe3AddressRedeemVO> {
    const serverResponse = await GET( `${API_HOST}/safe3/redeems/${address}` );
    return serverResponse;
}