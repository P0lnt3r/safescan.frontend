import { useMemo } from "react"
import { Line } from '@ant-design/plots';

export interface AverageBlockTimesChartType {
    date: string,
    time: number
}

export default ({ averageBlockTimes, config }: {
    averageBlockTimes?: AverageBlockTimesChartType[],
    config?: any
}) => {

    const data = useMemo(() => {
        if (!averageBlockTimes) {
            return [];
        }
        return averageBlockTimes;
    }, [averageBlockTimes]);

    const _config = {
        ...config,
        data,
        xField: 'date',
        yField: 'time',
        point: {
            size: 5,
            shape: 'diamond',
            style: {
                fill: 'white',
                stroke: '#5B8FF9',
                lineWidth: 2,
            },
        },
        tooltip: {
            showMarkers: false,
        },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: '#000',
                    fill: 'red',
                },
            },
        },
        interactions: [
            {
                type: 'marker-active',
            },
        ],
    };
    return <Line {..._config} />;


}