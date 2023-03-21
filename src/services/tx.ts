import { TransactionVO, PageQueryDTO, PageResponseVO, POST, EventLogVO, ERC20TransferVO , AddressPropVO } from "./index.d";
import config from "../config";
import { useDispatch } from "react-redux";
import { AnyAction } from "@reduxjs/toolkit";
import { Application_Update_AddressPropMap } from "../state/application/action";
const API_HOST = config.api_host;

export async function fetchTransactions( params : PageQueryDTO , dispatch: (action: AnyAction) => any ) : Promise<PageResponseVO<TransactionVO>> {
    const serverResponse = await POST( `${API_HOST}/txs` , { ...params } );
    const pageVO = serverResponse.data as PageResponseVO<TransactionVO>;
    
    // 将交易数据中的地址属性信息内容更新到 state 
    const addressPropVOArr : AddressPropVO[] = [];
    pageVO.records.forEach( txvo => {
        txvo.fromPropVO && addressPropVOArr.push(txvo.fromPropVO);
        txvo.toPropVO && addressPropVOArr.push(txvo.toPropVO);
    });
    dispatch(Application_Update_AddressPropMap(addressPropVOArr));

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