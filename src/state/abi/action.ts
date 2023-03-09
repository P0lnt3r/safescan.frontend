import { createAction } from '@reduxjs/toolkit';

export const Abi_Save = createAction<{address : string , abi: string}[]>("Abi_Save");

export const Abi_Init_Map = createAction<string>("Abi_Init_Map");

