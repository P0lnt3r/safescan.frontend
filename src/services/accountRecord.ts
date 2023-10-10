import { AddressBalanceRankVO, AddressPropVO, AddressVO, POST,GET, PageQueryDTO, PageResponseVO, AccountRecordVO, SafeAccountManagerActionVO } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchAddressAccountRecord( params : { address : string } | PageQueryDTO ) : Promise< PageResponseVO<AccountRecordVO> > {
    const serverResponse = await POST( `${API_HOST}/accountRecords/address` , params );
    return serverResponse.data;
}

export async function fetchAccountRecord( params : {} | PageQueryDTO ) : Promise< PageResponseVO<AccountRecordVO> > {
    const serverResponse = await POST( `${API_HOST}/accountRecords` , params );
    return serverResponse.data;
}

export async function fetchTxSafeAccountManagerAction( txHash : string ) : Promise< SafeAccountManagerActionVO[] > {
    const serverResponse = await POST( `${API_HOST}/accountmanager/${txHash}` ,{} );
    return serverResponse.data;
}

export async function fetchSafeAccountManagerActions( params : { recordId : string } | PageQueryDTO ) : Promise< PageResponseVO< SafeAccountManagerActionVO > > {
    const serverResponse = await POST( `${API_HOST}/accountmanager/actions` , params );
    return serverResponse.data;
}

export async function fetchAccountRecordById( id : string ) : Promise< AccountRecordVO > {
    const serverResponse = await POST( `${API_HOST}/accountRecords/${id}` ,{} );
    return serverResponse.data;
}

