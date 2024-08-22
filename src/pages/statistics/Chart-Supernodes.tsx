
import { DualAxes } from '@ant-design/plots';

export interface SupernodesChartType {
    date: string,
    count: number,
    rewards: number
}

export default ({ loading , supernodesChartData, config }: {
    loading : boolean,
    supernodesChartData?: SupernodesChartType[],
    config?: any
}) => {
    const _config = {
        ...config,
        data: [supernodesChartData, supernodesChartData],
        padding: 'auto',
        xField: 'date',
        yField: ['count', 'rewards'],
        xAxis: {
            tickCount: 5,
        },
        geometryOptions: [
            {
                geometry: 'column',
            },
            {
                geometry: 'line',
                lineStyle: {
                    lineWidth: 2,
                },
            },
        ]
    }

    return <>
        <DualAxes loading={loading} {..._config} />
    </>

}