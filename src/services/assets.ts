import { AbiMethodSignatureVO, AddressAbiVO, ERC20TokenVO, GET, POST, PageQueryDTO, PageResponseVO, TokenInfoVO, NftTokenVO, NftTokenHoldRankVO, NftTokenAssetVO, NftAssetVO } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchERC20Tokens( params : PageQueryDTO ) : Promise<PageResponseVO<ERC20TokenVO>> {
    const serverResponse = await POST( `${API_HOST}/assets/erc20tokens` , { ...params } );
    return serverResponse.data;
}

export async function fetchNftTokens( params : PageQueryDTO ) : Promise<PageResponseVO<NftTokenVO>> {
    const serverResponse = await POST( `${API_HOST}/assets/nftTokens` , { ...params } );
    return serverResponse.data;
}

export async function fetchToken( address : string ) : Promise<TokenInfoVO> {
    const serverResponse = await POST( `${API_HOST}/token/${address}` , {} );
    return serverResponse.data;
}

export async function fetchNftTokenHoldRank( token : string , params : PageQueryDTO ) : Promise<PageResponseVO<NftTokenHoldRankVO>> {
    const serverResponse = await POST( `${API_HOST}/assets/${token}/rank` , {...params} );
    return serverResponse.data;
}

export async function fetchNftTokenInventory( params : { token : string , address : string } | PageQueryDTO ) : Promise<PageResponseVO<NftTokenAssetVO>>{
    const serverResponse = await POST( `${API_HOST}/assets/inventory` , {...params} );
    return serverResponse.data;
}

export async function fetchNftAsset( token : string , tokenId : string ) : Promise<NftAssetVO> {
    const serverResponse = await POST( `${API_HOST}/assets/nft/${token}/${tokenId}` , {} );
    return serverResponse.data;
}






