
import { Area } from '@ant-design/plots';
import { useEffect, useMemo, useState } from 'react';

export interface AddressesChartType {
    date : string , 
    count : number
}

export default ( { data , config} : {
    data : AddressesChartType[] ,
    config : {} 
} ) => {

    const _config =  {
        ...config,
        data,
        xField: 'date',
        yField: 'count',
    };

    return <>
        <Area {..._config} />
    </>

}