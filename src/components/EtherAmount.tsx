import { BigintIsh, CurrencyAmount, JSBI } from '@uniswap/sdk';
import config from '../config';
import { Typography } from 'antd';
import { format } from '../utils/NumberFormat'
const NATIVE_LABEL = config.native_label;
const { Text } = Typography;

export function GWEI( raw : BigintIsh  , fixed ?: number){
    return format(CurrencyAmount.ether(raw).multiply("1000000000").toFixed( fixed ? fixed : 18 ))
}

export function ETHER( raw : BigintIsh , fixed ?: number ){
    return CurrencyAmount.ether(raw).toFixed( fixed );
}

export function ETHER_Combine( raws : string[] , fixed ?: number ){
    let total = CurrencyAmount.ether("0");
    for( let i in raws ){
        total = CurrencyAmount.ether(raws[i]).add(total);  
    }
    let fixedVal = fixed ? total.toFixed(fixed) : total.toFixed(18);
    return format(fixedVal);
}

export default ( { raw , fix , ignoreLabel , forceFix } : { raw : string | bigint , fix?:number , ignoreLabel ?: boolean , forceFix ?: boolean } ) => {

    const currencyAmount = raw ? CurrencyAmount.ether(raw) : CurrencyAmount.ether(JSBI.BigInt(0));
    let amount = currencyAmount.toExact();
    if ( fix ){
        amount = currencyAmount.toFixed( fix ) ;
        amount = format(amount,fix , forceFix);
    }
    return <>
        <>{amount} { !ignoreLabel && NATIVE_LABEL }</> 
    </>
}


