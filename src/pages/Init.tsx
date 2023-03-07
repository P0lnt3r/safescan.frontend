import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AddressPropVO, BlockchainContextVO, BlockVO, TransactionVO } from "../services";
import { fectAllAddressProp } from "../services/address";
import { Application_Update_AddressPropMap, Application_Update_BlockchainContext } from "../state/application/action";

export default () => {
    const dispatch =  useDispatch();
    useEffect( ()=>{
        const ws = new WebSocket("ws://10.0.0.249:8080/socket.io/blockchain");
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
    } , []);
    return (<></>);
}