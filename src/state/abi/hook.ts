
import { AnyAction } from '@reduxjs/toolkit';
import { FormatTypes, Fragment, Interface } from 'ethers/lib/utils';
import { useSelector, useDispatch } from 'react-redux'
import { fetchAddressAbi } from '../../services/utils';
import { AppState } from '../index';
import { Abi_Save } from './action';
import json_IERC20 from '../../abi/IERC20.json';

export function useAddressFunctionFragment(address: string, hex: string, dispatch: (action: AnyAction) => any): Fragment | undefined {
    const isFunction = hex.length === 10 ;
    const result = useSelector((state: AppState) => {
        const addressAbiJson = state.abi.abiMap?.get(address);
        if ( addressAbiJson ){
            return {
                type : "address" , 
                json : addressAbiJson
            };
        }
        const addressPropVO = state.application.addressPropMap.get(address);
        if ( addressPropVO && addressPropVO.subType ){
            if ( "erc20" === addressPropVO.subType ){
                return {
                    type : "common" , 
                    json : json_IERC20
                }
            }
            if ( "erc721" === addressPropVO.subType ){
                
            }
        }
        const methodSignature = state.application.methodSignature.get(hex);
        if ( methodSignature ){
            return {
                type : "methodsignature",
                json : [`${isFunction?"function":"event"} ${methodSignature}`]
            }
        }
        return undefined;
    });
    if ( !result || result.type !== "address" ){
        fetchAddressAbi({ address }).then((data) => {
            dispatch(Abi_Save(data));
        })
    }
    if ( result ){
        const IContract = new Interface( result.json );
        return isFunction ? IContract.getFunction(hex)
                : IContract.getEvent(hex);
    }
    return undefined;
}


export function useAddressEventFragment() {

}
