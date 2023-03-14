import { ABI_DECODE_DEF } from ".";
import { FormatTypes, Fragment, Interface } from 'ethers/lib/utils';

import IERC20 from "../../abi/IERC20.json";

export enum CommonAbiType {
    ERC20 = "erc20",
    ERC721 = "erc721"
}

export const CommonAbi_Config: { [type in CommonAbiType]: any } = {
    "erc20": IERC20,
    "erc721": IERC20
}

export function getCommonFragment( type : CommonAbiType , hex : string ){
    const abi = CommonAbi_Config[type];
    return getFragment( abi , hex );
}

export function getFragment(abi: any, hex: string): Fragment | undefined {
    const isFunction = hex.length == 10;
    try {
        const IContract = new Interface(abi);
        return isFunction ? IContract.getFunction(hex)
            : IContract.getEvent(hex);
    } catch(error) {

    }
    return undefined;
}





