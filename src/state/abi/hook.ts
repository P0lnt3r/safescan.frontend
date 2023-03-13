
import { AnyAction } from '@reduxjs/toolkit';
import { Fragment, Interface } from 'ethers/lib/utils';
import { useSelector, useDispatch } from 'react-redux'
import { fetchAddressAbi } from '../../services/utils';
import { AppState } from '../index';
import { Abi_Save } from './action';
import json_IERC20 from '../../abi/IERC20.json';

export function useAddressFunctionFragment(address: string, methodId: string, dispatch: (action: AnyAction) => any): Fragment | undefined {
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
        const methodSignature = state.application.methodSignature.get(methodId);
        if ( methodSignature ){
            return {
                type : "methodsignature",
                json : [`function ${methodSignature}`]
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
        return new Interface( result.json ).getFunction(methodId);
    }
    return undefined;
}

export function useAddressEventFragment() {

}
