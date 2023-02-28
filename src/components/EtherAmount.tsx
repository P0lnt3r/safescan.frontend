import { CurrencyAmount } from '@uniswap/sdk';
import config from '../config';
import { Typography } from 'antd';

const NATIVE_LABEL = config.native_label;
const { Text } = Typography;

export default ( { raw , fix } : { raw : string | bigint , fix?:number } ) => {
    let amount = CurrencyAmount.ether(raw).toFixed( fix ? fix : 6 );
    if ( amount === "0.000000" ){
        amount = "0";
    }
    return <>
        <Text strong>{amount} {NATIVE_LABEL}</Text>
    </>
}
