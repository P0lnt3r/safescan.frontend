import { ABI_DECODE_DEF } from ".";

export enum Topics {
    Transfer = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
}

export const Topics_Config : { [ topic in Topics ] : ABI_DECODE_DEF } = {
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" : {
        name : "Transfer (index_topic_1 address from, index_topic_2 address to, uint256 value)",
        indexed:[
            {name : "from" , type : "address"},
            {name : "to" , type : "address"},
        ],
        data:[
            {name : "value" , type:"uint256"}
        ]
    }
}



