import { createReducer } from '@reduxjs/toolkit';
import { Abi_Init_Map, Abi_Save } from './action';

export interface AbiVO {
    address : string ,
    abi : any
}

export interface AbiState {
    abis : AbiVO[] , 
    abiMap? : Map<string ,string>
}

const initialState : AbiState = {
    abis : [

    ]
}

export default createReducer( initialState , (builder) => {
    builder.addCase( Abi_Init_Map , ( state , { payload } ) => {
        const map = new Map<string , string>();
        state.abis.forEach( ( {address , abi} ) => {
            map.set(address,abi)
        });
        state.abiMap = map;
        return state;
    })
    builder.addCase( Abi_Save  , ( state , { payload } ) => {
        payload.forEach(({address , abi}) => {
            state.abis.push({address,abi})
            state.abiMap?.set(address,abi)
            return state;
        })
    })
    return initialState;
    
})