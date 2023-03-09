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
        { address : "1" , abi:"2" }
    ]
}



export default createReducer( initialState , (builder) => {
    
    builder.addCase( Abi_Init_Map , () => {
        
    } )

    builder.addCase( Abi_Save  , ( state , { payload } ) => {
        payload.forEach( ({address , abi}) => {
            
        })
    })
    return initialState;
    
})