import { createReducer } from '@reduxjs/toolkit';
import { AddressPropVO, BlockVO, TransactionVO } from '../../services';
import { Application_Notification, Application_Update_AddressPropMap, Application_Update_BlockchainContext, NotificationType } from './action';


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

const methodSignature = new Map();
methodSignature.set(
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    "Transfer (index_topic_1 address from, index_topic_2 address to, uint256 value)"
);
methodSignature.set(
    "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
    "Sync (uint112 reserve0, uint112 reserve1)"
);
methodSignature.set(
    "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
    "Swap (index_topic_1 address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, index_topic_2 address to)"
);
methodSignature.set(
    "0x627059660ea01c4733a328effb2294d2f86905bf806da763a89cee254de8bee5",
    "feeBurned (uint256 amount)"
);

const initialState: IApplicationState = {
    blockNumber : 0 ,
    methodSignature,
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
    .addCase( Application_Update_BlockchainContext , ( state , {payload} ) => {
        const { latestBlockNumber , latestBlocks , latestTransactions } = payload;
        return { ...state , 
            blockNumber:latestBlockNumber , 
            latestBlocks , 
            latestTransactions 
        }
    } )
});