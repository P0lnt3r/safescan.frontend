
import { Line } from '@ant-design/plots';
import { DualAxes } from '@ant-design/plots';

export interface MasternodesChartType {
    date: string,
    count: number,
    rewards: number
}

export default ({ masternodesChartData, config }: {
    masternodesChartData?: MasternodesChartType[],
    config?: any
}) => {

    const _config = {
        ...config,
        data: [masternodesChartData, masternodesChartData],
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
        <DualAxes {..._config} />
    </>

}