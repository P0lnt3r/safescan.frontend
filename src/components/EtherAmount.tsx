import { CurrencyAmount } from '@uniswap/sdk';
import config from '../config';
import { Typography } from 'antd';
import { format } from '../utils/NumberFormat'
const NATIVE_LABEL = config.native_label;
const { Text } = Typography;

export function GWEI( raw : string ){
    return format(CurrencyAmount.ether(raw).multiply("1000000000").toFixed(18))
}

export default ( { raw , fix } : { raw : string | bigint , fix?:number } ) => {
    let amount = CurrencyAmount.ether(raw).toFixed( fix ? fix : 6 );
    amount = format(amount);
    return <>
        <Text strong>{amount} {NATIVE_LABEL}</Text> 
    </>
}


