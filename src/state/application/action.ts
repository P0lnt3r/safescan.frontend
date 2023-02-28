
import { createAction } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const Application_Notification = createAction<{
    type : NotificationType , 
    title : string , 
    content : string
}>("Application_Notification");

