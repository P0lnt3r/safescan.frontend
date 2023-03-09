
import { AnyAction } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux'
import { fetchAddressAbi } from '../../services/utils';
import { AppState } from '../index'
import { Abi_Save } from './action';

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