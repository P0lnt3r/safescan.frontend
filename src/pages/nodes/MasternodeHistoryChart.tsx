import { useEffect, useState } from "react"
import { fetchAll } from "../../services/chart"
import ChartMasternodes, { MasternodesChartType } from "../statistics/Chart-Masternodes";
import { JSBI } from "@uniswap/sdk";
import { ETHER } from "../../components/EtherAmount";

export default () => {
    const [nodesChartData, setNodesChartData] = useState<MasternodesChartType[]>([]);
    const [loading ,setLoading] = useState<boolean>(false);
    useEffect(() => {
        setLoading(true);
        fetchAll().then(data => {
            const _nodesChartData : MasternodesChartType[] = [];
            data.forEach(timestampStatistic => {
                const { totalMasterNodes } = timestampStatistic;
                // 解析区块及奖励
                const { date, totalMasternodeRewards } = timestampStatistic;
                const rewards = JSBI.subtract(JSBI.BigInt(totalMasternodeRewards),
                    JSBI.BigInt(_nodesChartData.length > 0 ? data[_nodesChartData.length - 1].totalMasternodeRewards : "0")
                );
                _nodesChartData.push({
                    date,
                    count: totalMasterNodes,
                    rewards: Number.parseFloat(ETHER(rewards, 4))
                })
            });
            setLoading(false);
            setNodesChartData(_nodesChartData);
        });
    }, [])
    return <>
        <ChartMasternodes loading={loading} masternodesChartData={nodesChartData} config={{ height: 300 }} />
    </>
}