import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AddressPropVO, BlockchainContextVO, BlockVO, TransactionVO } from "../services";
import { fectAllAddressProp } from "../services/address";
import { fetchAbiMethodSignature } from "../services/utils";
import { Application_Update_AbiMethodSignature, Application_Update_AddressPropMap, Application_Update_BlockchainContext } from "../state/application/action";
import config from '../config'
import { Abi_Init_Map } from "../state/abi/action";

const WS_HOST = config.ws_host;
export default () => {
    const dispatch =  useDispatch();
    useEffect( ()=>{

        dispatch( Abi_Init_Map("") );       

        const ws = new WebSocket(`${WS_HOST}/blockchain`);
        ws.onopen = function (e) {

        }
        ws.onmessage = (msg) => {
            console.log('On Message :' , msg);
            const json = JSON.parse(msg.data) as BlockchainContextVO;
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