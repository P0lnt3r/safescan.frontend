import { createAction } from '@reduxjs/toolkit';
import { AddressAbiVO } from '../../services';

export const Abi_Save = createAction<AddressAbiVO[]>("Abi_Save");

export const Abi_Init_Map = createAction<string>("Abi_Init_Map");

