import { ABI_DECODE_DEF } from ".";
import { FormatTypes, Fragment, Interface } from 'ethers/lib/utils';

import IERC20 from "../../abi/IERC20.json";
import IERC721 from "../../abi/IERC721.json";
import IERC1155 from "../../abi/IERC1155.json";
import SystemContractAbiConfig from './SystemContractAbi';

export enum SystemContract {
    SystemProperty      = "0x0000000000000000000000000000000000001000",
    AccountManager      = "0x0000000000000000000000000000000000001010",
    MasterNodeStorage   = "0x0000000000000000000000000000000000001020",
    MasterNodeLogic     = "0x0000000000000000000000000000000000001025",
    SuperNodeStorage    = "0x0000000000000000000000000000000000001030",
    SuperNodeLogic      = "0x0000000000000000000000000000000000001035",
    SNVote              = "0x0000000000000000000000000000000000001040",
    MasterNodeState     = "0x0000000000000000000000000000000000001050",
    SuperNodeState      = "0x0000000000000000000000000000000000001060",
    Proposal            = "0x0000000000000000000000000000000000001070",
    SystemReward        = "0x0000000000000000000000000000000000001080",
    SAFE3               = "0x0000000000000000000000000000000000001090",
    MultiCall           = "0x0000000000000000000000000000000000001100",

    SafeswapV2Factory   = "0xB3c827077312163c53E3822defE32cAffE574B42",
    SafeswapV2Router    = "0x6476008C612dF9F8Db166844fFE39D24aEa12271",
}

export const SysContractABI: { [address in SystemContract]: string } = {
    [SystemContract.SystemProperty]     : SystemContractAbiConfig.PropertyABI,
    [SystemContract.AccountManager]     : SystemContractAbiConfig.AccountManagerABI,
    [SystemContract.MasterNodeStorage]  : SystemContractAbiConfig.MasterNodeStorageABI,
    [SystemContract.MasterNodeLogic]    : SystemContractAbiConfig.MasterNodeLogicABI,
    [SystemContract.SuperNodeStorage]   : SystemContractAbiConfig.SuperNodeStorageABI,
    [SystemContract.SuperNodeLogic]     : SystemContractAbiConfig.SuperNodeLogicABI,
    [SystemContract.SNVote]             : SystemContractAbiConfig.SNVoteABI,
    [SystemContract.MasterNodeState]    : SystemContractAbiConfig.MasterNodeStateABI,
    [SystemContract.SuperNodeState]     : SystemContractAbiConfig.SuperNodeStateABI,
    [SystemContract.Proposal]           : SystemContractAbiConfig.ProposalABI,
    [SystemContract.SystemReward]       : SystemContractAbiConfig.SystemRewardABI,
    [SystemContract.SAFE3]              : SystemContractAbiConfig.Safe3ABI,
    [SystemContract.MultiCall]          : SystemContractAbiConfig.MulticallABI,

    [SystemContract.SafeswapV2Factory]  : SystemContractAbiConfig.SafeswapV2FactoryABI,
    [SystemContract.SafeswapV2Router]   : SystemContractAbiConfig.SafeswapV2RouterABI
}

export enum CommonAbiType {
    ERC20 = "erc20",
    ERC721 = "erc721",
    ERC1155 = "erc1155"
}

export const CommonAbi_Config: { [type in CommonAbiType]: any } = {
    "erc20": IERC20,
    "erc721": IERC721,
    "erc1155": IERC1155
}

export function getCommonFragment(type: CommonAbiType, hex: string) {
    const abi = CommonAbi_Config[type];
    return getFragment(abi, hex);
}


export function getFragment(abi: any, hex: string): Fragment | undefined {
    const isFunction = hex.length == 10;
    try {
        const IContract = new Interface(abi);
        return isFunction ? IContract.getFunction(hex)
            : IContract.getEvent(hex);
    } catch (error) {

    }
    return undefined;
}




