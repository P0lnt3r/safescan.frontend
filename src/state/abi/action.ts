import { createAction } from '@reduxjs/toolkit';

export const Abi_Save = createAction<{address : string , abi: string}[]>("Abi_Save");

