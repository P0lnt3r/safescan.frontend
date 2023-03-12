
import { useSelector, useDispatch } from 'react-redux'
import { AddressPropVO, BlockVO, TransactionVO } from '../../services';
import { Abi_Method_Define } from '../../utils/decode';
import ParseABIDefine from '../../utils/decode/ParseABIDefine';
import { AppState } from '../index'

export function useMethodSignature(methodHex: string): Abi_Method_Define | undefined {
    const signature = useSelector((state: AppState) => state.application.methodSignature.get(methodHex));
    if (signature) {
        return ParseABIDefine(signature);
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


