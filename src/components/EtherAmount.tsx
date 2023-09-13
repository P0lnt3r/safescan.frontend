import { CurrencyAmount } from '@uniswap/sdk';
import config from '../config';
import { Typography } from 'antd';
import { format } from '../utils/NumberFormat'
const NATIVE_LABEL = config.native_label;
const { Text } = Typography;

export function GWEI( raw : string ){
    return format(CurrencyAmount.ether(raw).multiply("1000000000").toFixed(18))
}

export function ETHER( raw : string , fixed ?: number ){
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

export default ( { raw , fix , ignoreLabel } : { raw : string | bigint , fix?:number , ignoreLabel ?: boolean } ) => {
    let amount = raw ? CurrencyAmount.ether(raw).toFixed( fix ? fix : 6 ) : "0";
    amount = format(amount);
    return <>
        <>{amount} { !ignoreLabel && NATIVE_LABEL}</> 
    </>
}


