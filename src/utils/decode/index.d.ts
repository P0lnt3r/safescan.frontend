export interface ABI_DECODE_DEF {
    name : string,
    indexed : ABI_DECODE_PROP[],
    data : ABI_DECODE_PROP[]
}
export interface ABI_DECODE_PROP {
    name : string ,
    type : string
}

export interface Abi_Method_Define {
    name : string , 
    signature : string,
    params : Abi_Method_Param[],
    indexed : Abi_Method_Param[],
    data : Abi_Method_Param[]
}
export interface Abi_Method_Param {
    index : number = 0,
    name : string , 
    type : string 
}

console.log('Hello');
