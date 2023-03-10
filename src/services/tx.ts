import { TransactionVO, PageQueryDTO, PageResponseVO, POST, EventLogVO, ERC20TransferVO } from "./index.d";
import config from "../config";
const API_HOST = config.api_host;

export async function fetchTransactions( params : PageQueryDTO ) : Promise<PageResponseVO<TransactionVO>> {
    const serverResponse = await POST( `${API_HOST}/txs` , { ...params } );
    return serverResponse.data;
}

export async function fetchTransaction( hash : string ) : Promise<TransactionVO> {
    const serverResponse = await POST( `${API_HOST}/tx` , { hash : hash } );
    return serverResponse.data;
}

export async function fetchEventLogs( txHash : string ) : Promise<EventLogVO[]> {
    const serverResponse = await POST( `${API_HOST}/tx/eventlogs` , { transactionHash : txHash } );
    return serverResponse.data;
}

export async function fetchAddressTransactions(params : { address : string } | PageQueryDTO) : Promise<PageResponseVO<TransactionVO>> {
    const serverResponse = await POST( `${API_HOST}/txs/address` , { ...params } );
    return serverResponse.data;
}

export async function fetchAddressERC20Transfers( params : { address : string } | PageQueryDTO ) : Promise<PageResponseVO<ERC20TransferVO>> {
    const serverResponse = await POST( `${API_HOST}/txs/erc20` , { ...params } );
    return serverResponse.data;
}