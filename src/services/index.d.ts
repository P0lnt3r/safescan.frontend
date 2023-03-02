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
    gasLimit: number,
    gasUsed: number,
    hash: string,
    miner: string,
    parentHash: string,
    reward: string,
    sha3Uncles: string,
    size: number,
    timestamp: number,
    totalDifficulty: number,
    txns: number
}

export interface TransactionVO {
    blockHash?: string
    blockNumber?: integer
    from?: string
    gas?: number
    gasPrice?: number
    gasUsed?: number
    hash?: string
    input?: string
    methodId?: string
    nonce?: number
    status?: number
    timestamp?: number
    to?: number
    transactionIndex?: number
    value?: number
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

