import { ABI_DECODE_DEF } from ".";
import { FormatTypes, Fragment, Interface } from 'ethers/lib/utils';
import IERC20 from "../../abi/IERC20.json";
import SystemContractAbiConfig from './SystemContractAbi';

/*
    系统配置参数合约:property.sol,          地址: 0x0000000000000000000000000000000000001002
    账户管理合约:AccountManager.sol         地址: 0x0000000000000000000000000000000000001012
    主节点合约:MasterNode.sol               地址: 0x0000000000000000000000000000000000001022
    超级节点合约:SuperMasterNode.sol,       地址: 0x0000000000000000000000000000000000001032
    超级节点投票合约:SMNVote.sol,           地址: 0x0000000000000000000000000000000000001042
    主节点状态合约:MasterNodeState.sol,     地址: 0x0000000000000000000000000000000000001052
    超级节点状态合约:SuperNodeState.sol,    地址: 0x0000000000000000000000000000000000001062
    提案合约:Proposal.sol,                  地址: 0x0000000000000000000000000000000000001072
    系统奖励合约"SystemReward.sol,          地址: 0x0000000000000000000000000000000000001082
*/
export enum SystemContract {
    SystemProperty      = "0x0000000000000000000000000000000000001002",
    AccountManager      = "0x0000000000000000000000000000000000001012",
    MasterNode          = "0x0000000000000000000000000000000000001022",
    SuperNode           = "0x0000000000000000000000000000000000001032",
    SuperNodeVote       = "0x0000000000000000000000000000000000001042",
    MasterNodeState     = "0x0000000000000000000000000000000000001052",
    SuperNodeState      = "0x0000000000000000000000000000000000001062",
    Proposal            = "0x0000000000000000000000000000000000001072",
    SystemReward        = "0x0000000000000000000000000000000000001082"
}

export const SysContractABI: { [address in SystemContract]: string } = {
    [SystemContract.SystemProperty]     : SystemContractAbiConfig._0x0000000000000000000000000000000000001002,
    [SystemContract.AccountManager]     : SystemContractAbiConfig._0x0000000000000000000000000000000000001012,
    [SystemContract.MasterNode]         : SystemContractAbiConfig._0x0000000000000000000000000000000000001022,
    [SystemContract.SuperNode]          : SystemContractAbiConfig._0x0000000000000000000000000000000000001032,
    [SystemContract.SuperNodeVote]      : SystemContractAbiConfig._0x0000000000000000000000000000000000001042,
    [SystemContract.MasterNodeState]    : SystemContractAbiConfig._0x0000000000000000000000000000000000001052,
    [SystemContract.SuperNodeState]     : SystemContractAbiConfig._0x0000000000000000000000000000000000001062,
    [SystemContract.Proposal]           : SystemContractAbiConfig._0x0000000000000000000000000000000000001072,
    [SystemContract.SystemReward]       : SystemContractAbiConfig._0x0000000000000000000000000000000000001082,
}

export enum CommonAbiType {
    ERC20 = "erc20",
    ERC721 = "erc721"
}

export const CommonAbi_Config: { [type in CommonAbiType]: any } = {
    "erc20": IERC20,
    "erc721": IERC20
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





