


import { AbiMethodSignatureVO, AddressAbiVO, ERC20TokenVO, GET, POST, PageQueryDTO, PageResponseVO, TokenInfoVO, NftTokenVO, NftTokenHoldRankVO, NftTokenAssetVO, NftAssetVO, Contract_Compile_VO, Contract_Compile_Result_VO } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchContracts( params : PageQueryDTO ) : Promise<PageResponseVO<Contract_Compile_VO>> {
    const serverResponse = await POST( `${API_HOST}/contracts` , { ...params } );
    return serverResponse.data;
}

export async function fetchContractCompileResult( address : string ) : Promise<Contract_Compile_Result_VO> {
    const serverResponse = await POST( `${API_HOST}/contracts/${address}/compile` );
    return serverResponse.data;
}