
import { createAction } from '@reduxjs/toolkit';
import { AddressPropVO, BlockchainContextVO, BlockVO, TransactionVO } from '../../services';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const Application_Notification = createAction<{
    type : NotificationType , 
    title : string , 
    content : string
}>("Application_Notification");

export const Application_Update_AddressPropMap = createAction<AddressPropVO[]>("Application_Update_AddressPropMap");

export const Application_Update_BlockchainContext = createAction<BlockchainContextVO>("Application_Update_BlockchainContext");


