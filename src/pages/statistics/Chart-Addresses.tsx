
import { Area } from '@ant-design/plots';
import { useEffect, useMemo, useState } from 'react';

export interface AddressesType {
    date : string , 
    count : number
}

export default ( { data , config} : {
    data ?: AddressesType[] ,
    config : {} 
} ) => {

    console.log("Addresses ChartData : " , data)
    const chartData = useMemo( () => {
        return data ? data : [];
    } , [data] );

    const _config =  {
        ...config,
        data : chartData,
        xField: 'date',
        yField: 'count',
        xAxis: {
            range: [0, 1],
        },
    };

    return <>
        <Area {..._config} />
    </>

}