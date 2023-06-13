import { AddressBalanceRankVO, AddressPropVO, AddressVO, POST,GET, PageQueryDTO, PageResponseVO, AccountRecordVO } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchAddressAccountRecord( params : { address : string } | PageQueryDTO ) : Promise< PageResponseVO<AccountRecordVO> > {
    const serverResponse = await POST( `${API_HOST}/accountRecords/address` , params );
    return serverResponse.data;
}