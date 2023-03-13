
import { useSelector, useDispatch } from 'react-redux'
import { AddressPropVO, BlockVO, TransactionVO } from '../../services';
import { Abi_Method_Define } from '../../utils/decode';
import ParseABIDefine from '../../utils/decode/ParseABIDefine';
import { AppState } from '../index';
import json_IERC20 from '../../abi/IERC20.json';
import { FormatTypes, Interface } from 'ethers/lib/utils';

export function useMethodSignature( address : string ,  hex : string): Abi_Method_Define | undefined {
    const isEvent = hex.length !== 10; 
    const result = useSelector((state: AppState) => { 
        const json = state.abi.abiMap?.get( address );
        if ( json ){
            return JSON.parse(json);
        }
        const addressPropVO = state.application.addressPropMap.get(address);
        if ( addressPropVO ){
            if ( "erc20" === addressPropVO.subType ){
                return json_IERC20;
            }
            if ( "erc721" === addressPropVO.subType ){
                
            }
        }
        return state.application.methodSignature.get(hex) 
    });
    if (result) {
        if ( typeof result === "string" ){
            return ParseABIDefine(result);
        }else{
            const IContract = new Interface(result);
            const fragment = isEvent ? IContract.getEvent(hex) : IContract.getFunction(hex);
            const fragmentSignature = fragment.format(FormatTypes.full);
            console.log("fragmentSignature :" , fragmentSignature);
            return ParseABIDefine( fragmentSignature.substring( fragmentSignature.indexOf(" ") ).trim());
        }
    }
    return undefined;
}

export function useAddressProp(address: string | undefined): AddressPropVO | undefined {
    return useSelector((state: AppState) => {
        return state.application.addressPropMap.get(address);
    });
}

export function useBlockNumber() : number {
    return useSelector( (state:AppState) => state.application.blockNumber );
}

export function useLatestBlocks() : BlockVO[] {
    return useSelector( (state:AppState) => state.application.latestBlocks );
}

export function useLatestTransactions() : TransactionVO[] {
    return useSelector( (state:AppState) => state.application.latestTransactions);
}


