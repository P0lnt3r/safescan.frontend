import { AbiMethodSignatureVO, AddressAbiVO, GET, POST } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchAbiMethodSignature( params? : any ) : Promise< AbiMethodSignatureVO[] > {
    const serverResponse = await GET( `${API_HOST}/utils/getAbiMethodSignature` , { ...params } );
    return serverResponse;
}

export async function fetchAddressAbi( params : { address : string } ) : Promise< AddressAbiVO[] >{
    const serverResponse = await POST( `${API_HOST}/utils/getAbi` , { ...params } );
    return serverResponse.data;
}