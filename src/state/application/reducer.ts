import { createReducer } from '@reduxjs/toolkit';
import { AbiMethodSignatureVO, AddressAbiVO, AddressPropVO, BlockVO, TransactionVO } from '../../services';
import { Application_Init, Application_Notification, Application_Save_ABI, Application_Update_AbiMethodSignature, Application_Update_AddressPropMap, Application_Update_BlockchainContext, NotificationType } from './action';
import { FormatTypes, Interface , Fragment } from 'ethers/lib/utils';

export interface IApplicationState {

    blockNumber : number,

    methodSignature? : Map<string , string>,
    addressPropMap?  : Map<string|undefined , AddressPropVO>

    latestBlocks    : BlockVO[]
    latestTransactions : TransactionVO[]

    abis : AddressAbiVO[],
    abiMap? : Map<string , any>,

    notification? : {
        type : NotificationType , 
        title : string , 
        content : string
    }
}

const initialState: IApplicationState = {
    blockNumber : 0 ,
    methodSignature: new Map(),
    addressPropMap: new Map(),
    latestBlocks: [],
    latestTransactions: [],
    abis:[]
}

export default createReducer( initialState , (builder) => {

    builder.addCase(Application_Init, (state, { payload }) => {
        state.addressPropMap = new Map();
        state.methodSignature = new Map();
        const map = new Map<string, string>();
        if ( !state.abis ){
            state.abis = [];
        }
        state.abis.forEach(({ address, abi }) => {
            map.set(address, JSON.parse(abi))
        });
        state.abiMap = map;
        return state;
    })

    .addCase( Application_Notification , ( state , { payload } ) => {
        state.notification = payload;
    })

    .addCase( Application_Update_AddressPropMap , ( state , { payload } ) => {
        payload.forEach( addressPropVO => {
            const { address } = addressPropVO;
            state.addressPropMap?.set( address , addressPropVO );
        });
    })

    .addCase( Application_Update_AbiMethodSignature , ( state , { payload } ) => {
        const abiMethodSignatureArr : AbiMethodSignatureVO[] = payload;
        abiMethodSignatureArr.forEach( abiMethodSignature => {
            state.methodSignature?.set( abiMethodSignature.hex , abiMethodSignature.signature );
        });
    })

    .addCase( Application_Update_BlockchainContext , ( state , {payload} ) => {
        const { latestBlockNumber , latestBlocks , latestTransactions } = payload;
        return { ...state , 
            blockNumber:latestBlockNumber , 
            latestBlocks , 
            latestTransactions 
        }
    })

    .addCase(Application_Save_ABI, (state, { payload }) => {
        payload.forEach(({ address, abi }) => {
            if (!state.abiMap?.get(address)) {
                state.abis.push({ address, abi })
            }
            state.abiMap?.set(address, abi)
            const IContract = new Interface(abi);
            for( let func in IContract.functions ){
                const funcSignHash = 
                IContract.getSighash(IContract.getFunction(func));
                console.log(funcSignHash);
            }
            for( let event in IContract.events ){
                console.log( IContract.getEvent(event).format(FormatTypes.full) )
                
                console.log( IContract.getEventTopic(IContract.getEvent(event)))
               
            }
            return state;
        })
    })

});