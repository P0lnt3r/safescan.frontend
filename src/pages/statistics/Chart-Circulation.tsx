import { Line } from '@ant-design/plots';
import { TimestampStatisticVO } from '../../services';
import { ETHER } from '../../components/EtherAmount';

export interface CirculationChartType {
    date: string,
    value: number,
    category: string
}

export function parseCirculationChartData(timestampStatistic: TimestampStatisticVO) {
    const { date, totalSupply, totalLockAmount, totalFreezeAmount } = timestampStatistic;
    return {
        supply: {
            date,
            value: Number(ETHER(totalSupply, 0)),
            category: "Circulation"
        },
        lock: {
            date,
            value: Number(ETHER(totalLockAmount, 0)),
            category: "Locked"
        },
        freeze: {
            date,
            value: Number(ETHER(totalFreezeAmount, 0)),
            category: "Stake"
        }
    }
}

export default ({ data , config }: {
    data: CirculationChartType[],
    config : any
}) => {
    const _config = {
        ...config,
        data,
        xField: 'date',
        yField: 'value',
        seriesField: 'category',
        xAxis: {
            type: 'time',
        },
        yAxis: {
            label: {
                // 数值格式化为千分位
                formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
        color: ['orange', 'rgba(0, 0, 0, 0.45)', 'rgb(6, 58, 156)'],
    };

    return <>
        <Line {..._config} />
    </>

}