import { AbiMethodSignatureVO, AddressAbiVO, ERC20TokenVO, GET, POST, PageQueryDTO, PageResponseVO, TokenInfoVO, ERC721TokenVO } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchERC20Tokens( params : PageQueryDTO ) : Promise<PageResponseVO<ERC20TokenVO>> {
    const serverResponse = await POST( `${API_HOST}/assets/erc20tokens` , { ...params } );
    return serverResponse.data;
}

export async function fetchERC721Tokens( params : PageQueryDTO ) : Promise<PageResponseVO<ERC721TokenVO>> {
    const serverResponse = await POST( `${API_HOST}/assets/erc721tokens` , { ...params } );
    return serverResponse.data;
}

export async function fetchToken( address : string ) : Promise<TokenInfoVO> {
    const serverResponse = await POST( `${API_HOST}/token/${address}` , {} );
    return serverResponse.data;
}


