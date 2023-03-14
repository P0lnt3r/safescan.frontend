
import { createAction } from '@reduxjs/toolkit';
import { AbiMethodSignatureVO, AddressAbiVO, AddressPropVO, BlockchainContextVO } from '../../services';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const Application_Notification = createAction<{
    type : NotificationType , 
    title : string , 
    content : string
}>("Application_Notification");

export const Application_Update_AddressPropMap = createAction<AddressPropVO[]>("Application_Update_AddressPropMap");

export const Application_Update_AbiMethodSignature = createAction<AbiMethodSignatureVO[]>("Application_Update_AbiMethodSignature");

export const Application_Update_BlockchainContext = createAction<BlockchainContextVO>("Application_Update_BlockchainContext");

export const Application_Save_ABI = createAction<AddressAbiVO[]>("Application_Save_ABI");

export const Application_Init = createAction<string>("Application_Init");
