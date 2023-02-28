
import { useSelector, useDispatch } from 'react-redux'
import { Abi_Method_Define } from '../../utils/decode';
import ParseABIDefine from '../../utils/decode/ParseABIDefine';
import { AppState } from '../index'

export function useMethodSignature( methodHex : string ) : Abi_Method_Define | undefined{
    const signature = useSelector((state: AppState) => state.application.methodSignature.get(methodHex));
    if ( signature ){
        return ParseABIDefine(signature);
    }
    return undefined;
}