
import { DualAxes } from '@ant-design/plots';

export interface BlocksRewardsChartType{
    date : string , 
    blocks : number , 
    rewards : number
}

export default ( {blocksRewards , config} : {
    blocksRewards ?: BlocksRewardsChartType[] , 
    config ?: any
} ) => {

    const _config = {
        ...config,
        data: [blocksRewards, blocksRewards],
        padding: 'auto',
        xField: 'date',
        yField: ['blocks', 'rewards'],
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