import { ChainId, JSBI, Token, TokenAmount } from "@uniswap/sdk"



export default ( { decimals , name , symbol , raw } : {
    decimals : number,
    name : string ,
    symbol : string,
    raw : string
} ) => {
    const token = new Token(ChainId.MAINNET , "" , decimals , name , symbol);
    new TokenAmount(token,JSBI.BigInt(raw));
}