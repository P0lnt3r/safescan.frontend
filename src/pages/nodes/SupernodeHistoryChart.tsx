import { useEffect, useState } from "react"
import { fetchAll } from "../../services/chart"
import { JSBI } from "@uniswap/sdk";
import { ETHER } from "../../components/EtherAmount";
import ChartSupernodes, { SupernodesChartType } from "../statistics/Chart-Supernodes";


export default () => {
    const [loading , setLoading] = useState<boolean>(false);
    const [nodesChartData, setNodesChartData] = useState<SupernodesChartType[]>([]);

    useEffect(() => {
        setLoading(true);
        fetchAll().then(data => {
            const _nodesChartData: SupernodesChartType[] = [];
            data.forEach(timestampStatistic => {
                // 解析区块及奖励
                const { date, totalSupernodeRewards , totalSuperNodes } = timestampStatistic;
                const rewards = JSBI.subtract(JSBI.BigInt(totalSupernodeRewards),
                    JSBI.BigInt(_nodesChartData.length > 0 ? data[_nodesChartData.length - 1].totalSupernodeRewards : "0")
                );
                _nodesChartData.push({
                    date,
                    count: totalSuperNodes,
                    rewards: Number.parseFloat(ETHER(rewards, 4))
                })
            });
            setLoading(false);
            setNodesChartData(_nodesChartData);
        });
    }, [])
    
    return <>
        <ChartSupernodes loading={loading} supernodesChartData={nodesChartData} config={{ height: 300 }} />
    </>

}