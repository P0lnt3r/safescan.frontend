
import { Column } from '@ant-design/plots';
import { useMemo } from 'react';

export interface GasUsedsChartType {
    date: string,
    used: number,
    burn: number,
}

export default ({ gasUseds, config }: {
    gasUseds?: GasUsedsChartType[],
    config?: any
}) => {
    const data = useMemo(() => {
        if ( ! gasUseds ){
            return [];
        }
        const _data : any[] = [];
        gasUseds.forEach( gasUsed => {
            const {date , used , burn} = gasUsed;
            _data.push({date , value : used , type : "Used (GWei)"})
            _data.push({date , value : burn , type : "Burn (GWei)"})
        })
        return _data;
    }, [gasUseds]);
    const _config = {
        ...config,
        data,
        isStack: true,
        xField: 'date',
        yField: 'value',
        seriesField: 'type',
       
    };
    return <Column {..._config} />;

}