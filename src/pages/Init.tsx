import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AddressPropVO } from "../services";
import { fectAllAddressProp } from "../services/address";
import { Application_Update_AddressPropMap } from "../state/application/action";

export default () => {
    const dispatch =  useDispatch();
    useEffect( ()=>{
        fectAllAddressProp().then( (arr : AddressPropVO[]) => {
            dispatch( Application_Update_AddressPropMap(arr) );
        } )
    } , []);
    return (<></>);
}