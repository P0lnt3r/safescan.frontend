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
    txns: number
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
    hasInternalError: number
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
    timestamp: integer
    to: string
    token: string
    tokenPropVO: AddressPropVO | null
    transactionHash: string
    value: string
}

export interface ContractInternalTransactionVO {
    id: number,
    blockNumber: number,
    error: string,
    from: string,
    gas: string,
    gasUsed: string,
    revertReason: string,
    status: number,
    to: string,
    transactionHash: string,
    transactionIndex: number,
    type: string,
    value: string
    level: number,
}

export interface BlockchainContextVO {
    latestBlockNumber: number,
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
    circulation: string
}

export interface AddressBalanceRankVO {
    rank: number,
    address: string,
    addressPropVO: AddressPropVO,
    balance: string,
    totalAmount : string
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
        balance: string
    }[]
}

export interface ERC20TokenVO {
    address: string,
    name: string,
    symbol: string,
    decimals: number,
    holders: number,
    totalTransfers: number,
    totalTransferAmount: string,
}

export interface MemberInfoVO {
    lockID: number,
    addr: string,
    amount: string,
    height: number,
}

export interface IncentivePlanVO {
    creator: number,
    partner: number,
    voter: number
}

export interface SuperMasterNodeVO {
    id: number
    amount: string,
    state: number,
    totalVoteNum: number,
    totalVoterAmount: number,
    createHeight: number,
    updateHeight: number,
    name: string,
    addr: string,
    enode: string,
    creator: string,
    ip: string,
    description: string,
    founders: MemberInfoVO[],
    voters: MemberInfoVO[],
    incentivePlan: IncentivePlanVO
}

export interface MasterNodeVO {
    id: number
    amount: string,
    state: number,
    createHeight: number,
    updateHeight: number,
    addr: string,
    enode: string,
    creator: string,
    ip: string,
    description: string,
    founders: MemberInfoVO[],
    incentivePlan: IncentivePlanVO
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
    amount: string
}

export interface AccountRecordVO {
    lockId: number,
    address: string,
    amount: string,
    lockDay: number,
    startHeight: number,
    unlockHeight: number,
    sepcialAddress: string,
    freezeHeight: number,
    unfreezeHeight: number,
    votedAddress: string,
    voteHeight: number,
    releaseHeight: number,
}

