import { AddressPropVO, POST } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fectAllAddressProp( ) : Promise< AddressPropVO[] > {
    const serverResponse = await POST( `${API_HOST}/addresses/prop`);
    return serverResponse.data;
}