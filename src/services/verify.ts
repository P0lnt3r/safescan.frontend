import { PageResponseVO , POST } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function contractCompile(params: any): Promise<PageResponseVO<any>> {
    const serverResponse = await POST(`${API_HOST}/verify/contract/compile`, { ...params });
    return serverResponse.data;
}
