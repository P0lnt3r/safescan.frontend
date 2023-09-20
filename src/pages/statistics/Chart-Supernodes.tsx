
import { Line } from '@ant-design/plots';

export interface SupernodesChartType {
    date: string,
    count: number
}

export default ({ supernodesChartData, config }: {
    supernodesChartData?: SupernodesChartType[],
    config?: any
}) => {
    const _config = {
        ...config,
        data : supernodesChartData,
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