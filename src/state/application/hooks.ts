
import { useSelector } from 'react-redux'
import { AddressPropVO, BlockVO, StatisticVO, TransactionVO } from '../../services';
import { Abi_Method_Define } from '../../utils/decode';
import ParseABIDefine from '../../utils/decode/ParseABIDefine';
import { AppState } from '../index';
import { FormatTypes, Interface, Fragment } from 'ethers/lib/utils';
import { CommonAbiType, getCommonFragment, getFragment } from '../../utils/decode/config';
import { Application_Save_ABI } from './action';
import { fetchAddressAbi } from '../../services/utils';
import { AnyAction } from '@reduxjs/toolkit';

export function useAddressProp(address: string): AddressPropVO | undefined {
    return useSelector((state: AppState) => {
        if (state.application.addressPropMap) {
            return state.application.addressPropMap?.get(address);
        }
        return undefined;
    });
    // return undefined;
}

export function useAddressAbi(address: string): any | undefined {
    return useSelector((state: AppState) => state.application.abiMap?.get(address));
}

export function useBlockNumber(): number {
    return useSelector((state: AppState) => state.application.blockNumber);
}

export function useBlockTimestamp(): number {
    return useSelector((state: AppState) => state.application.latestTimestamp);
}

export function useDBStoredBlockNumber(): number {
    return useSelector((state: AppState) => state.application.dbStoredBlockNumber);
}

export function useStatistic(): StatisticVO | undefined {
    return useSelector((state: AppState) => state.application.statistic);
}

export function useLatestBlocks(): BlockVO[] {
    return useSelector((state: AppState) => state.application.latestBlocks);
}

export function useLatestTransactions(): TransactionVO[] {
    return useSelector((state: AppState) => state.application.latestTransactions);
}

export function useMethodIdName(address: string, methodId: string, subType?: string): string {
    return useSelector((state: AppState) => {
        if (!methodId) {
            return "Transfer";
        }
        const addressAbiJson = state.application.abiMap?.get(address);
        if (addressAbiJson) {
            const byAddressAbi = getFragment(addressAbiJson, methodId);
            if (byAddressAbi) {
                return byAddressAbi.name;
            }
        }
        const addressPropVO = state.application.addressPropMap?.get(address);
        if ((addressPropVO && addressPropVO.subType in CommonAbiType)
            || subType) {
            const _subTpye = subType ? subType :
                (addressPropVO && addressPropVO.subType);

            const byCommonAbi = getCommonFragment(_subTpye as CommonAbiType, methodId);
            if (byCommonAbi) {
                return byCommonAbi.name;
            }
        }
        const methodSignature = state.application.methodSignature?.get(methodId);
        if (methodSignature) {
            const IContract = new Interface([`function ${methodSignature}`]);
            return IContract.getFunction(methodId).name;
        }
        return methodId;
    });
}

export function useAddressFunctionFragment(
    address: string, hex: string, dispatch: (action: AnyAction) => any, subType?: string): Fragment | undefined {
    return useSelector((state: AppState) => {
        if (!hex || hex.length < 10) {
            return undefined;
        }
        const isFunction = hex.length === 10;
        const addressAbiJson = state.application.abiMap?.get(address);
        if (addressAbiJson) {
            const byAddressAbi = getFragment(addressAbiJson, hex);
            if (byAddressAbi) {
                return byAddressAbi;
            }
        }
        if (!addressAbiJson) {
            fetchAddressAbi({ address }).then((data) => {
                if ( data.length != 0 ){
                    dispatch(Application_Save_ABI(data));
                }
            })
        }
        const addressPropVO = state.application.addressPropMap?.get(address);
        if ((addressPropVO && addressPropVO.subType in CommonAbiType)
            || subType) {
            const _subTpye = subType ? subType :
                (addressPropVO && addressPropVO.subType);
            const byCommonAbi = getCommonFragment(_subTpye as CommonAbiType, hex);
            if (byCommonAbi) {
                return byCommonAbi;
            }
        }
        const methodSignature = state.application.methodSignature?.get(hex);
        if (methodSignature) {
            const IContract = new Interface([`${isFunction ? "function" : "event"} ${methodSignature}`]);
            return isFunction ? IContract.getFunction(hex)
                : IContract.getEvent(hex);
        }
        return undefined;
    });
}

export function useMethodSignature(address: string, hex: string): Abi_Method_Define | undefined {

    return useSelector((state: AppState) => {
        const json = state.application.abiMap?.get(address);
        const byAddressAbi = getFragment(json, hex);
        if (byAddressAbi) {
            const fragmentSignature = byAddressAbi.format(FormatTypes.full);
            return ParseABIDefine(fragmentSignature);
        }
        const addressPropVO = state.application.addressPropMap?.get(address);
        if (addressPropVO) {
            const { subType } = addressPropVO;
            if (subType in CommonAbiType) {
                const byCommonAbi = getCommonFragment(subType as CommonAbiType, hex);
                if (byCommonAbi) {
                    const fragmentSignature = byCommonAbi.format(FormatTypes.full);
                    return ParseABIDefine(fragmentSignature);
                }
            }
        }
        const methodSignature = state.application.methodSignature?.get(hex);
        if (methodSignature) {
            return ParseABIDefine(methodSignature);
        }
        return undefined;
    });

}



