import { createReducer } from '@reduxjs/toolkit';
import { AbiMethodSignatureVO, AddressAbiVO, AddressPropVO, BlockVO, StatisticVO, TransactionVO } from '../../services';
import { Application_Init, Application_Notification, Application_Save_ABI, Application_Update_AbiMethodSignature, Application_Update_AddressPropMap, Application_Update_BlockchainContext, NotificationType } from './action';
import { FormatTypes, Interface, Fragment } from 'ethers/lib/utils';
import { SysContractABI, SystemContract } from '../../utils/decode/config';
import { add } from 'date-fns';

export interface IApplicationState {

    blockNumber: number,
    latestTimestamp: number,
    dbStoredBlockNumber: number,

    methodSignature?: Map<string, string>,
    addressPropMap?: Map<string, AddressPropVO>

    latestBlocks: BlockVO[]
    latestTransactions: TransactionVO[]
    statistic?: StatisticVO

    abis: AddressAbiVO[],
    abiMap?: Map<string, any>,

    notification?: {
        type: NotificationType,
        title: string,
        content: string
    }
}

const initialState: IApplicationState = {
    blockNumber: 0,
    latestTimestamp : 0,
    dbStoredBlockNumber: 0,
    methodSignature: new Map(),
    addressPropMap: new Map(),
    latestBlocks: [],
    latestTransactions: [],
    statistic : undefined, 
    abis: []
}

export default createReducer(initialState, (builder) => {

    builder.addCase(Application_Init, (state, { payload }) => {
        state.addressPropMap = new Map();
        state.methodSignature = new Map();
        state.abiMap = new Map();
        const map = new Map<string, string>();
        if (!state.abis) {
            state.abis = [];
        }
        for ( const address in SysContractABI){
            state.abis.push( {
                address ,
                abi : SysContractABI[address as SystemContract]
            } )
        }
        state.abis.forEach(({ address, abi }) => {
            ////////////////////////////////////////////////////////////////////////////////////////////////
            state.abiMap?.set(address, abi)
            const IContract = new Interface(abi);
            for (let func in IContract.functions) {
                const functionFragment = IContract.getFunction(func);
                if (!functionFragment.constant) {
                    let functionFragmentFormat = functionFragment.format(FormatTypes.full);
                    functionFragmentFormat = functionFragmentFormat.substring(
                        functionFragmentFormat.indexOf(" "),
                        functionFragmentFormat.lastIndexOf("returns") > 0 ?
                            functionFragmentFormat.lastIndexOf("returns") : functionFragmentFormat.length
                    ).trim();
                    const funcSignHash = IContract.getSighash(IContract.getFunction(func));
                    if (state.methodSignature && !state.methodSignature.get(funcSignHash)) {
                        state.methodSignature?.set(funcSignHash, functionFragmentFormat);
                    }
                }
            }
            for (let event in IContract.events) {
                const eventFragment = IContract.getEvent(event);
                let eventFragmentFormat = eventFragment.format(FormatTypes.full);
                eventFragmentFormat = eventFragmentFormat.substring(
                    eventFragmentFormat.indexOf(" ")
                ).trim();
                const eventSignHash = IContract.getEventTopic(eventFragment);
                if (state.methodSignature && !state.methodSignature.get(eventSignHash)) {
                    state.methodSignature?.set(eventSignHash, eventFragmentFormat);
                }
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////
            map.set(address, JSON.parse(abi))
        });
        state.abiMap = map;
        return state;
    })

        .addCase(Application_Notification, (state, { payload }) => {
            state.notification = payload;
        })

        .addCase(Application_Update_AddressPropMap, (state, { payload }) => {
            payload.forEach(addressPropVO => {
                const { address } = addressPropVO;
                if (state.addressPropMap){
                    state.addressPropMap.set(address, addressPropVO);
                }
            });
        })

        .addCase(Application_Update_AbiMethodSignature, (state, { payload }) => {
            const abiMethodSignatureArr: AbiMethodSignatureVO[] = payload;
            abiMethodSignatureArr.forEach(abiMethodSignature => {
                state.methodSignature?.set(abiMethodSignature.hex, abiMethodSignature.signature);
            });
        })

        .addCase(Application_Update_BlockchainContext, (state, { payload }) => {
            const { latestBlockNumber, latestBlockTimestamp , dbStoredBlockNumber , latestBlocks, latestTransactions , statistic } = payload;
            return {
                ...state,
                blockNumber: latestBlockNumber,
                dbStoredBlockNumber : dbStoredBlockNumber,
                latestTimestamp : latestBlockTimestamp ,
                latestBlocks,
                latestTransactions,
                statistic
            }
        })

        .addCase(Application_Save_ABI, (state, { payload }) => {
            payload.forEach(({ address, abi }) => {
                if (!state.abiMap?.get(address)) {
                    const IContract = new Interface(abi);
                    state.abis.push({ address, abi: JSON.stringify(IContract.format(FormatTypes.full)) })
                }
                state.abiMap?.set(address, abi)
                const IContract = new Interface(abi);
                for (let func in IContract.functions) {
                    const functionFragment = IContract.getFunction(func);
                    if (!functionFragment.constant) {
                        let functionFragmentFormat = functionFragment.format(FormatTypes.full);
                        functionFragmentFormat = functionFragmentFormat.substring(
                            functionFragmentFormat.indexOf(" "),
                            functionFragmentFormat.lastIndexOf("returns") > 0 ?
                                functionFragmentFormat.lastIndexOf("returns") : functionFragmentFormat.length
                        ).trim();
                        const funcSignHash = IContract.getSighash(IContract.getFunction(func));
                        if (state.methodSignature && !state.methodSignature.get(funcSignHash)) {
                            state.methodSignature?.set(funcSignHash, functionFragmentFormat);
                        }
                    }
                }
                for (let event in IContract.events) {
                    const eventFragment = IContract.getEvent(event);
                    let eventFragmentFormat = eventFragment.format(FormatTypes.full);
                    eventFragmentFormat = eventFragmentFormat.substring(
                        eventFragmentFormat.indexOf(" ")
                    ).trim();
                    const eventSignHash = IContract.getEventTopic(eventFragment);
                    if (state.methodSignature && !state.methodSignature.get(eventSignHash)) {
                        state.methodSignature?.set(eventSignHash, eventFragmentFormat);
                    }
                }
                return state;
            })
        })
});