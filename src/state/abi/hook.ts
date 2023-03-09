
import { useSelector, useDispatch } from 'react-redux'
import { fetchAddressAbi } from '../../services/utils';
import { AppState } from '../index'

export function useAddressAbi( address : string ){
    // const json = useSelector((state: AppState) => {
    //     console.log(state.abi?.abiMap.get);
    //     return state.abi.abiMap.get(address);
    // });
    // if ( ! json ){
    //     fetchAddressAbi( { addresses : [address] } ).then( (data) => {
    //         console.log(data);
    //     } )
    // }
}