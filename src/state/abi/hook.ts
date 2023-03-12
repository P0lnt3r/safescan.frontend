
import { AnyAction } from '@reduxjs/toolkit';
import { Fragment, Interface } from 'ethers/lib/utils';
import { useSelector, useDispatch } from 'react-redux'
import { fetchAddressAbi } from '../../services/utils';
import { AppState } from '../index'
import { Abi_Save } from './action';

export function useAddressFunctionFragment( address : string , methodId : string , dispatch: (action: AnyAction) => any ) : Fragment | undefined {
    const json = useSelector((state: AppState) => {
        return state.abi.abiMap?.get(address);
    });
    if ( !json ){
        fetchAddressAbi({ addresses: [address] }).then((data) => {
            dispatch(Abi_Save(data));
        })
        return undefined;
    }else{
        const IContract = new Interface(json);
        return IContract.getFunction(methodId);
    }
}

export function useAddressEventFragment(){

}


export function useAddressAbi(address: string, dispatch: (action: AnyAction) => any) {
    const json = useSelector((state: AppState) => {
        return state.abi.abiMap?.get(address);
    });
    if (!json) {
        fetchAddressAbi({ addresses: [address] }).then((data) => {
            dispatch(Abi_Save(data));
        })
    }
    return json;
}