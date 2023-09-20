
import { Line } from '@ant-design/plots';

export interface MasternodesChartType {
    date: string,
    count: number
}

export default ({ masternodesChartData, config }: {
    masternodesChartData?: MasternodesChartType[],
    config?: any
}) => {
    const _config = {
        ...config,
        data : masternodesChartData,
        padding: 'auto',
        xField: 'date',
        yField: 'count',
        xAxis: {
            tickCount: 5,
        },
    }

    return <>
        <Line {..._config} />
    </>

}