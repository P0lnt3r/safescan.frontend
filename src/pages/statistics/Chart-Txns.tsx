
import { Line } from '@ant-design/plots';
import { TimestampStatisticVO } from '../../services';
import { useEffect, useState } from 'react';

export interface TxnsType {
    date : string , 
    txns : number
}

export default ( { data } : {
    data : TxnsType[]
} ) => {

    const config = {
        data,
        xField: 'date',
        yField: 'txns',
        xAxis: {
            // type: 'timeCat',
            tickCount: 5,
        },
        smooth: true,
    };

    return <>
        <Line {...config} />
    </>

}