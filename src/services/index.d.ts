import { Topics } from "../utils/decode/config";

export const POST = async function (url: string, params?: any): Promise<ApiResponse<any>> {
    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(params)
    })
    const json = await response.json();
    return json as ApiResponse<any>;
}

export const GET = async function (url: string, params?: any): Promise<any> {
    const URI_params = params ? "?" + obj2URIParams(params) : undefined;
    const response = await fetch(URI_params ? url + URI_params : url, {
        method: 'get',
        headers: {
            'Content-Type': "application/json"
        }
    })
    const json = await response.json();
    return json as any;
}

function obj2URIParams(data: any) {
    var _result = [];
    for (var key in data) {
        var value = data[key];
        if (value.constructor === Array) {
            value.forEach(function (_value) {
                _result.push(key + "=" + _value);
            });
        } else {
            _result.push(key + '=' + value);
        }
    }
    return _result.join('&');
}


export interface ApiResponse<VO> {
    code: string,
    msg: string,
    data: VO
}

export interface PageResponseVO<VO> {
    current: number,
    pageSize: number,
    total: number,
    totalPages: number,
    records: VO[],
}

export interface PageQueryDTO {
    current: number | undefined,
    pageSize: number | undefined,
    orderMode?: string | undefined,
    orderProp?: string | undefined,
    blockNumber?: number
}

export interface BlockVO {
    number: number,
    difficulty: number,
    extraData: string,
    gasLimit: string,
    gasUsed: string,
    hash: string,

    miner: string,
    minerPropVO: AddressPropVO | undefined

    parentHash: string,
    reward: string,
    sha3Uncles: string,
    size: string,
    timestamp: number,
    totalDifficulty: string,
    txns: number,

    confirmed: number
}

export interface TransactionVO {
    blockHash: string
    blockNumber: integer
    from: string,
    fromPropVO: AddressPropVO | undefined
    gas: string
    gasPrice: string
    gasUsed: string
    hash: string
    input: string
    methodId: string
    nonce: number
    status: number
    timestamp: number
    to: string
    toPropVO: AddressPropVO | undefined
    transactionIndex: number
    value: string,
    error: string,
    revertReason: string,
    hasInternalError: number,
    confirmed: number
}

export interface EventLogVO {
    address: string
    blockNumber: integer
    data: string
    logIndex: integer
    timestamp: integer
    topic0: Topics
    topicsArr: string
    transactionHash: string
    transactionIndex: integer
}

export interface AddressPropVO {
    address: string
    type: string
    subType: string
    tag: string
    prop: string | null
    remark: string | null
}

export interface ERC20TransferVO {
    from: string
    fromPropVO : AddressPropVO
    timestamp: integer
    to: string
    toPropVO : AddressPropVo
    token: string
    tokenPropVO: AddressPropVO | null
    transactionHash: string
    value: string
    confirmed : number
    blockNumber : number
}

export interface ContractInternalTransactionVO {
    id: string,
    blockNumber: number,
    error: string,
    from: string,
    fromPropVO: AddressPropVO | undefined,
    gas: string,
    gasUsed: string,
    revertReason: string,
    status: number,
    to: string,
    toPropVO: AddressPropVO | undefined,
    transactionHash: string,
    transactionIndex: number,
    type: string,
    value: string,
    level: number,
    timestamp: number,
    confirmed: number
}

export interface BlockchainContextVO {
    latestBlockNumber: number,
    latestBlockTimestamp: number,
    dbStoredBlockNumber: number,
    latestTransactions: TransactionVO[],
    latestBlocks: BlockVO[],
    statistic: StatisticVO,
}

export interface AbiMethodSignatureVO {
    method: string
    signature: string
    hex: string
}

export interface AddressAbiVO {
    address: string,
    abi: string
}

export interface StatisticVO {
    totalTxns: number,
    totalInternalTxns: number,
    totalERC20Transfers: number,
    totalAddress: number,
    totalContract: number,
    totalRewards: string,
    circulation: string,
    totalMasterNodes: number
}

export interface AddressBalanceRankVO {
    rank: number,
    address: string,
    addressPropVO: AddressPropVO,
    balance: string,
    totalAmount: string,
    lockAmount: string,
    freezeAmount: string,
    totalBalance: string,
    token ?: string , 
    tokenPropVO ?: AddressPropVO,
    changeBefore24H ?: string
    changeBefore24HPercent ?: string
    changeBefore7D ?: string
    changeBefore7DPercent ?: string
    changeBefore30D ?: string
    changeBefore30DPercent ?: string
}

export interface ERC20AddressBalanceVO {
    balance : string , 
    token : string , 
    tokenPropVO : AddressPropVO,
    changeBefore24H ?: string
    changeBefore24HPercent ?: string
    changeBefore7D ?: string
    changeBefore7DPercent ?: string
    changeBefore30D ?: string
    changeBefore30DPercent ?: string
}

export interface AddressVO {
    address: string,
    type: string,
    propVO?: AddressPropVO,
    balance: {
        balance: string,
        txCount: number,
        totalAmount: string,
        availableAmount: string,
        lockAmount: string,
        freezeAmount: string,
    },
    tokens: {
        token: string,
        tokenPropVO: AddressPropVO,
        balance: string
    }[],
    erc721TokenAssetCounts : {
        token : string , 
        tokenPropVO : AddressPropVO,
        tokenAssetCount : number
    }[],
    contract?: ContractVO , 
    firstTxBlockNumber: number,
    firstTxHash: string,
    firstTxTimestamp: number,
    latestTxBlockNumber: number,
    latestTxHash: string,
    latestTxTimestamp: number
}

export interface ContractVO {
    address: string,
    creator: string,
    creatorBlockNumber: number,
    creatorTransactionHash: string,
    creatorTimestamp: number,
    selfDestructTransactionHash: string,
    selfDestructBlockNumber: number,
    selfDestructTimestamp: number
}

export interface ERC20TokenVO {
    address: string,
    name: string,
    symbol: string,
    decimals: number,
    holders: number,
    totalTransfers: number,
    totalTransferAmount: string,
    totalSupply : string
}

export interface MemberInfoVO {
    lockID: number,
    addr: string,
    amount: string,
    height: number,

    lockDay?: number,
    unlockHeight?: number,
    releaseHeight?: number,
    unfreezeHeight?: number,
}

export interface IncentivePlanVO {
    creator: number,
    partner: number,
    voter: number
}

export interface SuperNodeVO {
    rank: number,
    id: number,
    amount: string,
    totalVoteNum: number,
    totalVoterAmount: number,
    voteObtainedRate: string,
    createHeight: number,
    updateHeight: number,
    lastRewardHeight: number,
    name: string,
    addr: string,
    enode: string,
    creator: string,
    ip: string,
    description: string,
    founders: MemberInfoVO[],
    incentivePlan: IncentivePlanVO,
    stateInfo: {
        state: number,
        height: number
    },
    voteInfo: {
        totalAmount: string,
        totalNum: string,
        height: number,
        voters: MemberInfoVO[]
    }
}

export interface MasterNodeVO {
    id: number
    amount: string,
    createHeight: number,
    updateHeight: number,
    addr: string,
    enode: string,
    creator: string,
    ip: string,
    description: string,
    founders: MemberInfoVO[],
    incentivePlan: IncentivePlanVO,
    stateInfo: {
        state: number,
        height: number
    },
    lastRewardHeight: number
}

export interface NodeRewardVO {
    blockNumber: number,
    timestamp: number,
    transactionHash: string,
    eventLogIndex: number,
    nodeAddress: string,
    nodeAddressPropVO?: AddressPropVO,
    nodeType: number,
    address: string,
    addressPropVO?: AddressPropVO
    rewardType: number,
    amount: string,
    confirmed: number
}

export interface AccountRecordVO {

    lockId: number,
    address: string,
    addressPropVO: AddressPropVO,
    amount: string,
    lockDay: number,
    startTxHash: string,
    startHeight: number,
    startTimestamp: number,
    addLockTxHash: string,
    unlockHeight: number,
    unlockTimestamp: number,

    specialAddress: string,
    nodeAddressPropVO: AddressPropVO,
    registerAction: string,
    registerActionTxHash: string,
    freezeHeight: number,
    freezeTimestamp: number,
    unfreezeHeight: number,
    unfreezeTimestamp: number,

    proxyMasternode: string,
    proxyAddressPropVO: AddressPropVO,
    proxyAction: string,
    proxyActionTxHash: string,
    proxyHeight: number,
    proxyTimestamp: number,

    votedAddress: string,
    votedAddressPropVO: AddressPropVO,
    voteAction: string,
    voteActionTxHash: string,
    voteHeight: number,
    voteTimestamp: number,
    releaseHeight: number,
    releaseTimestamp: number,

    recordState: number,
    withdrawHeight: number,
    withdrawTimestamp: number,
    withdrawTxHash: string

}

export interface SafeAccountManagerActionVO {
    blockNumber: number,
    timestamp: number,
    transactionHash: string,
    eventLogIndex: number,
    action: string,
    from: string | undefined,
    to: string,
    amount: string,
    lockDay: number,
    lockId: string,
}

export interface NodeRegisterActionVO {
    blockNumber: number,
    timestamp: number,
    transactionHash: string,
    eventLogIndex: number,
    nodeType: string,
    registerType: string,
    address: string,
    operator: string,
    amount: string,
    lockDays: number,
    lockId: number
}


export interface TimestampStatisticVO {
    date: string,
    blockNumberStart: number,
    blockNumberEnd: number,
    totalTxns: number,
    totalInternalTxns: number,
    totalERC20Transfers: number,
    totalContract: number,
    totalSuperNodes: number,
    totalMasterNodes: number,
    totalRewards: string,
    totalSupply: string,
    totalLockAmount: string,
    totalFreezeAmount: string
}

export interface TokenInfoVO {
    address : string , 
    contractVO : ContractVO , 
    erc20TokenVO : ERC20TokenVO
}

export interface ERC721TokenVO {
    address: string,
    name: string,
    symbol: string,
    holders: number,
    totalTransfers: number,
    totalAssets : number
}

export interface ERC721TransferVO {
    from: string
    fromPropVO : AddressPropVO
    timestamp: integer
    to: string
    toPropVO : AddressPropVo,
    toContract: string,
    toContractPropVO : AddressPropVO
    token: string
    tokenPropVO: AddressPropVO | null
    transactionHash: string
    tokenId: string
    confirmed : number
    blockNumber : number
}