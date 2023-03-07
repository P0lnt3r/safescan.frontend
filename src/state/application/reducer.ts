import { createReducer } from '@reduxjs/toolkit';
import { AbiMethodSignatureVO, AddressPropVO, BlockVO, TransactionVO } from '../../services';
import { Application_Notification, Application_Update_AbiMethodSignature, Application_Update_AddressPropMap, Application_Update_BlockchainContext, NotificationType } from './action';


export interface IApplicationState {
    blockNumber : number,
    methodSignature : Map<string , string>,
    addressPropMap  : Map<string|undefined , AddressPropVO>
    latestBlocks    : BlockVO[]
    latestTransactions : TransactionVO[]

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
    latestTransactions: []
}

export default createReducer( initialState , (builder) => {
    builder.addCase( Application_Notification , ( state , { payload } ) => {
        state.notification = payload;
    })
    .addCase( Application_Update_AddressPropMap , ( state , { payload } ) => {
        payload.forEach( addressPropVO => {
            const { address } = addressPropVO;
            state.addressPropMap.set( address , addressPropVO );
        });
    })
    .addCase( Application_Update_AbiMethodSignature , ( state , { payload } ) => {
        const abiMethodSignatureArr : AbiMethodSignatureVO[] = payload;
        abiMethodSignatureArr.forEach( abiMethodSignature => {
            state.methodSignature.set( abiMethodSignature.hex , abiMethodSignature.signature );
        });
    } )
    .addCase( Application_Update_BlockchainContext , ( state , {payload} ) => {
        const { latestBlockNumber , latestBlocks , latestTransactions } = payload;
        return { ...state , 
            blockNumber:latestBlockNumber , 
            latestBlocks , 
            latestTransactions 
        }
    })
});