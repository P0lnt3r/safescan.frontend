import { createReducer } from '@reduxjs/toolkit';
import { Abi_Save } from './action';

export interface AbiVO {
    address : string ,
    abi : any
}

export interface AbiState {
    abis : AbiVO[] , 
    map : Map<string ,string>
}

const initialState : AbiState = {
    abis : [
        { address : "1" , abi:"2" }
    ],
    map : new Map<string , string>()
}

export default createReducer( initialState , (builder) => {

    initialState.abis.forEach( ({address,abi})=>{
        initialState.map.set(address,abi);
    })

    builder.addCase( Abi_Save  , ( state , { payload } ) => {
        payload.forEach( ({address , abi}) => {
            if ( ! state.map.get(address) ){
                state.map.set(address , abi);
                state.abis.push({address , abi})
            }
        })
    })
    
})