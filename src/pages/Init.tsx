import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AddressPropVO, BlockchainContextVO, BlockVO, TransactionVO } from "../services";
import { fectAllAddressProp } from "../services/address";
import { fetchAbiMethodSignature } from "../services/utils";
import { Application_Init, Application_Update_AbiMethodSignature, Application_Update_AddressPropMap, Application_Update_BlockchainContext } from "../state/application/action";
import config from '../config'

const WS_HOST = config.ws_host;
export default () => {
    const dispatch =  useDispatch();
    useEffect( ()=>{
        dispatch( Application_Init("") );       
        const ws = new WebSocket(`${WS_HOST}/blockchain`);
        ws.onopen = function (e) {
            
        }
        ws.onmessage = (msg) => {
            const json = JSON.parse(msg.data) as BlockchainContextVO;
            // console.log('OnMes:' , {
            //     db : json.dbStoredBlockNumber,
            //     bl : json.latestBlockNumber
            // });
            dispatch( Application_Update_BlockchainContext(json) )            
        };
        ws.onclose = function (e) {
        }
        fectAllAddressProp().then( (arr : AddressPropVO[]) => {
            dispatch( Application_Update_AddressPropMap(arr) );
        })
        fetchAbiMethodSignature().then( (arr) => {
            dispatch( Application_Update_AbiMethodSignature(arr) )
        });
    } , []);
    return (<></>);
}