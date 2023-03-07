import { AbiMethodSignatureVO, GET } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchAbiMethodSignature( params? : any ) : Promise< AbiMethodSignatureVO[] > {
    const serverResponse = await GET( `${API_HOST}/utils/abi_method_signature` , { ...params } );
    return serverResponse;
}