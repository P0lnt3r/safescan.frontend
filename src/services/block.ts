import { BlockVO, PageQueryDTO, PageResponseVO, POST } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchBlocks( params : PageQueryDTO | { } ) : Promise<PageResponseVO<BlockVO>> {
    const serverResponse = await POST( `${API_HOST}/blocks` , { ...params } );
    return serverResponse.data;
}

export async function fetchBlock( number : number | undefined , hash : string | undefined ) : Promise<BlockVO> {
    const serverResponse = await POST( `${API_HOST}/block` , { number , hash } );
    return serverResponse.data;
}